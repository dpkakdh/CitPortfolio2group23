using System.Net.Http.Json;
using Microsoft.Extensions.Caching.Memory;
using Portfolio2group23.Models;

namespace Portfolio2group23.Services
{
    public class TmdbService
    {
        private readonly HttpClient _http;
        private readonly IMemoryCache _cache;
        private readonly string _apiKey;

        private const string ImageBaseW185 = "https://image.tmdb.org/t/p/w185";

        // Concurrency cap to avoid hammering TMDB
        private static readonly SemaphoreSlim _tmdbConcurrency = new(4, 4);

        public TmdbService(HttpClient http, IConfiguration config, IMemoryCache cache)
        {
            _http = http;
            _cache = cache;
            _apiKey = config["Tmdb:ApiKey"] ?? "";

            if (_http.BaseAddress == null)
                _http.BaseAddress = new Uri("https://api.themoviedb.org/3/");
        }

        // -----------------------------
        // Person search (kept for fallback / manual lookups)
        // -----------------------------
        public async Task<TmdbPerson?> SearchPersonAsync(string name, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(_apiKey)) return null;
            if (string.IsNullOrWhiteSpace(name)) return null;

            name = name.Trim();

            var cacheKey = $"tmdb:searchperson:{name.ToLowerInvariant()}";
            if (_cache.TryGetValue(cacheKey, out TmdbPerson? cached))
                return cached;

            var url = $"search/person?api_key={_apiKey}&query={Uri.EscapeDataString(name)}";

            await _tmdbConcurrency.WaitAsync(ct);
            try
            {
                var result = await _http.GetFromJsonAsync<TmdbSearchResponse>(url, ct);
                var person = result?.Results?.FirstOrDefault();

                _cache.Set(cacheKey, person, TimeSpan.FromDays(7));
                return person;
            }
            finally
            {
                _tmdbConcurrency.Release();
            }
        }

        // -----------------------------
        // Best practice: Cast lookup by IMDb ID (handles movie_results + tv_results)
        // Falls back to actor-name search if mapping/credits missing.
        // -----------------------------
        public async Task<List<TmdbCastMember>> GetCastForImdbAsync(
            string imdbId,
            int take = 10,
            CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(_apiKey)) return new();
            if (string.IsNullOrWhiteSpace(imdbId)) return new();

            imdbId = imdbId.Trim();
            take = Math.Clamp(take, 1, 50);

            var cacheKey = $"tmdb:cast:imdb:{imdbId.ToLowerInvariant()}:{take}";
            if (_cache.TryGetValue(cacheKey, out List<TmdbCastMember>? cached))
                return cached;

            var findUrl = $"find/{Uri.EscapeDataString(imdbId)}?api_key={_apiKey}&external_source=imdb_id";

            await _tmdbConcurrency.WaitAsync(ct);
            try
            {
                var find = await _http.GetFromJsonAsync<TmdbFindResponse>(findUrl, ct);

                // Prefer movie match; if none, try TV match
                var tmdbMovieId = find?.MovieResults?.FirstOrDefault()?.Id;
                if (tmdbMovieId is int movieId && movieId > 0)
                {
                    var cast = await GetCreditsInternalAsync(kind: "movie", id: movieId, take: take, ct: ct);
                    _cache.Set(cacheKey, cast, TimeSpan.FromDays(3));
                    return cast;
                }

                var tmdbTvId = find?.TvResults?.FirstOrDefault()?.Id;
                if (tmdbTvId is int tvId && tvId > 0)
                {
                    var cast = await GetCreditsInternalAsync(kind: "tv", id: tvId, take: take, ct: ct);
                    _cache.Set(cacheKey, cast, TimeSpan.FromDays(3));
                    return cast;
                }

                // No mapping found
                var empty = new List<TmdbCastMember>();
                _cache.Set(cacheKey, empty, TimeSpan.FromHours(12));
                return empty;
            }
            finally
            {
                _tmdbConcurrency.Release();
            }
        }

        // Public helper used by controller as a fallback when IMDb mapping is missing
        public async Task<List<TmdbCastMember>> GetCastFromActorNamesAsync(
            string? actors,
            int take = 10,
            CancellationToken ct = default)
        {
            take = Math.Clamp(take, 1, 20);

            var names = ParseActorNames(actors, take);
            if (names.Count == 0) return new();

            // Parallelize within your global TMDB concurrency cap (SearchPersonAsync also uses the cap)
            var tasks = names.Select(async n =>
            {
                var p = await SearchPersonAsync(n, ct);
                return new TmdbCastMember
                {
                    Name = n,
                    TmdbId = p?.Id,
                    Character = null,
                    AvatarUrl = p?.ProfileUrl
                };
            });

            return (await Task.WhenAll(tasks)).ToList();
        }

        private async Task<List<TmdbCastMember>> GetCreditsInternalAsync(
            string kind, // "movie" or "tv"
            int id,
            int take,
            CancellationToken ct)
        {
            var creditsUrl = $"{kind}/{id}/credits?api_key={_apiKey}";
            var credits = await _http.GetFromJsonAsync<TmdbCreditsResponse>(creditsUrl, ct);

            return (credits?.Cast ?? new List<TmdbCreditsCast>())
                .Take(take)
                .Select(c => new TmdbCastMember
                {
                    Name = c.Name,
                    TmdbId = c.Id,
                    Character = c.Character,
                    AvatarUrl = string.IsNullOrWhiteSpace(c.ProfilePath) ? null : $"{ImageBaseW185}{c.ProfilePath}"
                })
                .ToList();
        }

        private static List<string> ParseActorNames(string? actors, int take)
        {
            return (actors ?? "")
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .Where(s => s.Length > 0 && !s.Equals("N/A", StringComparison.OrdinalIgnoreCase))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .Take(take)
                .ToList();
        }
    }
}

using System.Text.Json.Serialization;

namespace Portfolio2group23.Models
{
    
    // SEARCH PERSON
    
    public class TmdbSearchResponse
    {
        [JsonPropertyName("results")]
        public List<TmdbPerson> Results { get; set; } = new();
    }

    public class TmdbPerson
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("profile_path")]
        public string? ProfilePath { get; set; }

        // Convenience: full image URL (w185)
        public string? ProfileUrl =>
            string.IsNullOrWhiteSpace(ProfilePath)
                ? null
                : $"https://image.tmdb.org/t/p/w185{ProfilePath}";
    }

    // -----------------------------
    // FIND BY IMDB ID
    // /find/{imdbId}?external_source=imdb_id
    // -----------------------------
    public class TmdbFindResponse
    {
        [JsonPropertyName("movie_results")]
        public List<TmdbFindMovie> MovieResults { get; set; } = new();

        [JsonPropertyName("tv_results")]
        public List<TmdbFindTv> TvResults { get; set; } = new();
    }

    public class TmdbFindMovie
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
    }

    public class TmdbFindTv
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
    }

    // -----------------------------
    // CREDITS (movie + tv share shape)
    // /movie/{id}/credits
    // /tv/{id}/credits
    // -----------------------------
    public class TmdbCreditsResponse
    {
        [JsonPropertyName("cast")]
        public List<TmdbCreditsCast> Cast { get; set; } = new();
    }

    public class TmdbCreditsCast
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("character")]
        public string? Character { get; set; }

        [JsonPropertyName("profile_path")]
        public string? ProfilePath { get; set; }
    }

    // -----------------------------
    // What YOUR API returns to frontend
    // -----------------------------
    public class TmdbCastMember
    {
        public string? Name { get; set; }
        public int? TmdbId { get; set; }
        public string? Character { get; set; }
        public string? AvatarUrl { get; set; }
    }
}

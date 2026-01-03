using Microsoft.EntityFrameworkCore;
using Portfolio2group23.DataServiceLayer.Data;
using Portfolio2group23.DataServiceLayer.Models;
using Portfolio2group23.DTOs;

namespace Portfolio2group23.Services
{
    public class SearchService
    {
        private readonly AppDbContext _db;

        public SearchService(AppDbContext db)
        {
            _db = db;
        }

        private static string[] Tokenize(string query)
        {
            return (query ?? "")
                .Trim()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Where(t => t.Length > 0)
                .Take(10)
                .ToArray();
        }

        public async Task<PagedResponse<MovieDto>> SearchTitlesPagedAsync(
            string query,
            int? userId,
            int page,
            int pageSize,
            CancellationToken ct = default)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);

            var terms = Tokenize(query);
            if (terms.Length == 0)
            {
                return new PagedResponse<MovieDto>
                {
                    Page = page,
                    PageSize = pageSize,
                    Total = 0,
                    Items = new List<MovieDto>()
                };
            }

            var skip = (page - 1) * pageSize;

            IQueryable<Title> baseQuery = _db.Titles.AsNoTracking();

            // AND match every term across PrimaryTitle / OriginalTitle
            foreach (var term in terms)
            {
                var pat = $"%{term}%";
                baseQuery = baseQuery.Where(t =>
                    (t.PrimaryTitle != null && EF.Functions.ILike(t.PrimaryTitle, pat)) ||
                    (t.OriginalTitle != null && EF.Functions.ILike(t.OriginalTitle, pat))
                );
            }

            var total = await baseQuery.CountAsync(ct);

            var items = await baseQuery
                .OrderByDescending(t => t.StartYear)
                .ThenBy(t => t.PrimaryTitle ?? t.OriginalTitle)
                .Skip(skip)
                .Take(pageSize)
                .Select(t => new MovieDto
                {
                    Tconst = t.Tconst,
                    Title = t.PrimaryTitle ?? t.OriginalTitle ?? "",
                    StartYear = t.StartYear,
                    AverageRating = t.TitleRating != null ? t.TitleRating.AverageRating : null,
                    NumVotes = t.TitleRating != null ? t.TitleRating.NumVotes : null,
                    PosterUrl = t.OmdbData != null ? t.OmdbData.Poster : null,

                    IsBookmarked = userId != null && t.BookmarkTitles.Any(b => b.UserId == userId.Value),
                    UserRating = userId != null
                        ? t.Ratings
                            .Where(r => r.UserId == userId.Value)
                            .Select(r => (int?)r.Value)
                            .FirstOrDefault()
                        : null
                })
                .ToListAsync(ct);

            if (userId != null)
            {
                _db.SearchHistories.Add(new SearchHistory
                {
                    UserId = userId.Value,
                    SearchQuery = string.Join(' ', terms),
                    SearchTime = DateTime.UtcNow,
                    ResultsCount = total
                });

                await _db.SaveChangesAsync(ct);
            }

            return new PagedResponse<MovieDto>
            {
                Page = page,
                PageSize = pageSize,
                Total = total,
                Items = items
            };
        }
    }
}

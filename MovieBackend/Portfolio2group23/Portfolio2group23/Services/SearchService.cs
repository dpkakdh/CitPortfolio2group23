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

        public async Task<List<MovieDto>> SearchTitlesAsync(string query, int? userId = null, int limit = 50)
        {
            query = query?.Trim() ?? "";
            if (query.Length == 0) return new List<MovieDto>();

            // Save search history if user is provided
            if (userId != null)
            {
                _db.SearchHistories.Add(new SearchHistory
                {
                    UserId = userId.Value,
                    SearchQuery = query,
                    SearchTime = DateTime.UtcNow
                });
                await _db.SaveChangesAsync();
            }

            return await _db.Titles
                .AsNoTracking()
                .Where(t => (t.PrimaryTitle ?? "").ToLower().Contains(query.ToLower()))
                .OrderByDescending(t => t.StartYear)
                .Take(limit)
                .Select(t => new MovieDto
                {
                    Tconst = t.Tconst,
                    Title = t.PrimaryTitle ?? "",
                    StartYear = t.StartYear,
                    AverageRating = t.TitleRating != null ? t.TitleRating.AverageRating : null,
                    NumVotes = t.TitleRating != null ? t.TitleRating.NumVotes : null,
                    PosterUrl = t.OmdbData != null ? t.OmdbData.Poster : null,
                    IsBookmarked = userId != null && t.BookmarkTitles.Any(b => b.UserId == userId),
                    UserRating = userId != null
                        ? t.Ratings.Where(r => r.UserId == userId).Select(r => (int?)r.Value).FirstOrDefault()
                        : null
                })
                .ToListAsync();
        }
    }
}

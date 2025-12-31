using Microsoft.EntityFrameworkCore;
using Portfolio2group23.DataServiceLayer.Data;
using Portfolio2group23.DTOs;

namespace Portfolio2group23.Services
{
    public class MovieService
    {
        private readonly AppDbContext _db;

        public MovieService(AppDbContext db)
        {
            _db = db;
        }

        // (query, userId, limit)  -> used by some controllers
        public Task<List<MovieDto>> SearchMoviesAsync(string query, int userId, int limit)
        {
            return SearchMoviesCoreAsync(query, userId, limit, offset: 0);
        }

        //// (query, limit, offset) -> used by some controllers
        //public Task<List<MovieDto>> SearchMoviesAsync(string query, int limit, int offset)
        //{
        //    return SearchMoviesCoreAsync(query, userId: null, limit: limit, offset: offset);
        //}

        // Main internal implementation (only ONE implementation)
        private async Task<List<MovieDto>> SearchMoviesCoreAsync(string query, int? userId, int limit, int offset)
        {
            query = query?.Trim() ?? "";
            if (query.Length == 0) return new List<MovieDto>();

            return await _db.Titles
                .AsNoTracking()
                .Where(t => (t.PrimaryTitle ?? "").ToLower().Contains(query.ToLower()))
                .OrderByDescending(t => t.StartYear)
                .Skip(offset)
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

        public async Task<MovieDto?> GetMovieByIdAsync(string tconst)
        {
            if (string.IsNullOrWhiteSpace(tconst)) return null;

            return await _db.Titles
                .AsNoTracking()
                .Where(t => t.Tconst == tconst)
                .Select(t => new MovieDto
                {
                    Tconst = t.Tconst,
                    Title = t.PrimaryTitle ?? "",
                    StartYear = t.StartYear,
                    AverageRating = t.TitleRating != null ? t.TitleRating.AverageRating : null,
                    NumVotes = t.TitleRating != null ? t.TitleRating.NumVotes : null,
                    PosterUrl = t.OmdbData != null ? t.OmdbData.Poster : null,
                    IsBookmarked = false,
                    UserRating = null
                })
                .FirstOrDefaultAsync();
        }
    }
}

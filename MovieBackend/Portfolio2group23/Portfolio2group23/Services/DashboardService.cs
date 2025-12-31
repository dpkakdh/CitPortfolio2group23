using Microsoft.EntityFrameworkCore;
using Portfolio2group23.DataServiceLayer.Data;

namespace Portfolio2group23.Services
{
    public class DashboardService
    {
        private readonly AppDbContext _db;

        public DashboardService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<object> GetDashboardAsync(int userId)
        {
            var bookmarkedTitles = await _db.BookmarkTitles
                .AsNoTracking()
                .Where(b => b.UserId == userId)
                .CountAsync();

            var bookmarkedNames = await _db.BookmarkNames
                .AsNoTracking()
                .Where(b => b.UserId == userId)
                .CountAsync();

            var ratingsCount = await _db.Ratings
                .AsNoTracking()
                .Where(r => r.UserId == userId)
                .CountAsync();

            var recentSearches = await _db.SearchHistories
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.SearchTime)
                .Take(10)
                .Select(s => new { s.SearchQuery, s.SearchTime })
                .ToListAsync();

            return new
            {
                bookmarkedTitles,
                bookmarkedNames,
                ratingsCount,
                recentSearches
            };
        }
    }
}

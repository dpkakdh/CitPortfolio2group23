using Microsoft.EntityFrameworkCore;
using Portfolio2group23.DataServiceLayer.Data;
using Portfolio2group23.DTOs;

namespace Portfolio2group23.Services
{
    public class BookmarkService
    {
        private readonly AppDbContext _db;
        public BookmarkService(AppDbContext db) => _db = db;

        public async Task<List<BookmarkDto>> GetUserBookmarksAsync(int userId)
        {
            var titles = await _db.BookmarkTitles
                .Where(b => b.UserId == userId)
                .Select(b => new BookmarkDto { Code = b.Tconst, Type = "title", CreatedAt = b.CreatedAt })
                .ToListAsync();

            var names = await _db.BookmarkNames
                .Where(b => b.UserId == userId)
                .Select(b => new BookmarkDto { Code = b.Nconst, Type = "name", CreatedAt = b.CreatedAt })
                .ToListAsync();

            return titles.Concat(names).OrderByDescending(b => b.CreatedAt).ToList();
        }
    }
}


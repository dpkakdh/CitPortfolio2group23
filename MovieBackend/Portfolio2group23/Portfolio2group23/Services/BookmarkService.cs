using Microsoft.EntityFrameworkCore;
using Portfolio2group23.DataServiceLayer.Data;
using Portfolio2group23.DTOs;

namespace Portfolio2group23.Services
{
    public class BookmarkService
    {
        private readonly AppDbContext _db;
        public BookmarkService(AppDbContext db) => _db = db;

        public async Task<PagedResponse<BookmarkDto>> GetUserBookmarksPagedAsync(int userId, int page, int pageSize)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);
            var skip = (page - 1) * pageSize;

            var titleQuery = _db.BookmarkTitles
                .AsNoTracking()
                .Where(b => b.UserId == userId)
                .Select(b => new BookmarkDto { Code = b.Tconst, Type = "title", CreatedAt = b.CreatedAt });

            var nameQuery = _db.BookmarkNames
                .AsNoTracking()
                .Where(b => b.UserId == userId)
                .Select(b => new BookmarkDto { Code = b.Nconst, Type = "name", CreatedAt = b.CreatedAt });

            var combined = titleQuery.Concat(nameQuery);

            var total = await combined.CountAsync();

            var items = await combined
                .OrderByDescending(b => b.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResponse<BookmarkDto>
            {
                Page = page,
                PageSize = pageSize,
                Total = total,
                Items = items
            };
        }

        public async Task<bool> RemoveTitleBookmarkAsync(int userId, string tconst)
        {
            var existing = await _db.BookmarkTitles.FirstOrDefaultAsync(b => b.UserId == userId && b.Tconst == tconst);
            if (existing == null) return false;
            _db.BookmarkTitles.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveNameBookmarkAsync(int userId, string nconst)
        {
            var existing = await _db.BookmarkNames.FirstOrDefaultAsync(b => b.UserId == userId && b.Nconst == nconst);
            if (existing == null) return false;
            _db.BookmarkNames.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}

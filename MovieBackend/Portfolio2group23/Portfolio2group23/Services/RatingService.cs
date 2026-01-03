using Microsoft.EntityFrameworkCore;
using Portfolio2group23.DataServiceLayer.Data;
using Portfolio2group23.DataServiceLayer.Models;
using Portfolio2group23.DTOs;

namespace Portfolio2group23.Services
{
    public class RatingService
    {
        private readonly AppDbContext _db;

        public RatingService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<(bool ok, string msg)> AddOrUpdateRatingAsync(int userId, RatingDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Tconst))
                return (false, "Missing tconst.");

            int value = (int)Math.Round(dto.Value);
            if (value < 1 || value > 10)
                return (false, "Rating must be between 1 and 10.");

            var existing = await _db.Ratings
                .FirstOrDefaultAsync(r => r.UserId == userId && r.Tconst == dto.Tconst);

            if (existing == null)
            {
                _db.Ratings.Add(new Rating
                {
                    UserId = userId,
                    Tconst = dto.Tconst,
                    Value = value,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });

                await _db.SaveChangesAsync();
                return (true, "Rating added.");
            }

            _db.RatingHistories.Add(new RatingHistory
            {
                UserId = userId,
                Tconst = dto.Tconst,
                Value = existing.Value,
                ChangedAt = DateTime.UtcNow
            });

            existing.Value = value;
            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return (true, "Rating updated.");
        }

        public async Task<(bool ok, string msg)> RemoveRatingAsync(int userId, string tconst)
        {
            if (string.IsNullOrWhiteSpace(tconst))
                return (false, "Missing tconst.");

            var existing = await _db.Ratings
                .FirstOrDefaultAsync(r => r.UserId == userId && r.Tconst == tconst);

            if (existing == null)
                return (false, "Rating not found.");

            _db.RatingHistories.Add(new RatingHistory
            {
                UserId = userId,
                Tconst = tconst,
                Value = existing.Value,
                ChangedAt = DateTime.UtcNow
            });

            _db.Ratings.Remove(existing);
            await _db.SaveChangesAsync();

            return (true, "Rating removed.");
        }

        public async Task<PagedResponse<RatingItemDto>> GetUserRatingsPagedAsync(int userId, int page, int pageSize)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);
            var skip = (page - 1) * pageSize;

            var baseQuery = _db.Ratings
                .AsNoTracking()
                .Where(r => r.UserId == userId);

            var total = await baseQuery.CountAsync();

            var items = await baseQuery
                .OrderByDescending(r => r.UpdatedAt)
                .Skip(skip)
                .Take(pageSize)
                .Select(r => new RatingItemDto
                {
                    Tconst = r.Tconst,
                    Value = r.Value,
                    UpdatedAt = r.UpdatedAt
                })
                .ToListAsync();

            return new PagedResponse<RatingItemDto>
            {
                Page = page,
                PageSize = pageSize,
                Total = total,
                Items = items
            };
        }
    }
}

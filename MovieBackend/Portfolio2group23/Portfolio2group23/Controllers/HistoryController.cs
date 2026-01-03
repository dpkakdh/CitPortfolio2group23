using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio2group23.DataServiceLayer.Data;
using Portfolio2group23.DTOs;
using System;
using System.Threading.Tasks;

namespace Portfolio2group23.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class HistoryController : ControllerBase
    {
        private readonly AppDbContext _db;

        public HistoryController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/history/search?page=1&pageSize=20
        [HttpGet("search")]
        public async Task<IActionResult> SearchHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            int uid = int.Parse(User.FindFirst("uid")!.Value);
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);
            var skip = (page - 1) * pageSize;

            var baseQuery = _db.SearchHistories
                .AsNoTracking()
                .Where(h => h.UserId == uid);

            var total = await baseQuery.CountAsync();

            var items = await baseQuery
                .OrderByDescending(h => h.SearchTime)
                .Skip(skip)
                .Take(pageSize)
                .Select(h => new SearchHistoryItemDto
                {
                    Id = h.Id,
                    Query = h.SearchQuery,
                    ResultsCount = h.ResultsCount,
                    SearchedAt = h.SearchTime
                })
                .ToListAsync();

            return Ok(new PagedResponse<SearchHistoryItemDto>
            {
                Page = page,
                PageSize = pageSize,
                Total = total,
                Items = items
            });
        }

        // GET /api/history/ratings?page=1&pageSize=20
        [HttpGet("ratings")]
        public async Task<IActionResult> RatingHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            int uid = int.Parse(User.FindFirst("uid")!.Value);
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);
            var skip = (page - 1) * pageSize;

            var baseQuery = _db.RatingHistories
                .AsNoTracking()
                .Where(h => h.UserId == uid);

            var total = await baseQuery.CountAsync();

            var items = await baseQuery
                .OrderByDescending(h => h.ChangedAt)
                .Skip(skip)
                .Take(pageSize)
                .Select(h => new RatingHistoryItemDto
                {
                    Id = h.Id,
                    Tconst = h.Tconst,
                    Value = h.Value,
                    ChangedAt = h.ChangedAt
                })
                .ToListAsync();

            return Ok(new PagedResponse<RatingHistoryItemDto>
            {
                Page = page,
                PageSize = pageSize,
                Total = total,
                Items = items
            });
        }
    }
}

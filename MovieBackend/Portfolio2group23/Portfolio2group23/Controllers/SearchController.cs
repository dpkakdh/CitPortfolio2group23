using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio2group23.DataServiceLayer.Data;
using Portfolio2group23.Services;
using System.Security.Claims;

namespace Portfolio2group23.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly SearchService _service;
        private readonly AppDbContext _db;

        public SearchController(SearchService service, AppDbContext db)
        {
            _service = service;
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var results = await _service.SearchTitlesAsync(q, page, pageSize);

            // Record search if user logged in
            var uid = User.FindFirst("uid")?.Value;
            if (uid != null)
            {
                _db.SearchHistories.Add(new DataServiceLayer.Models.SearchHistory
                {
                    UserId = int.Parse(uid),
                    Query = q,
                    ResultsCount = results.Count,
                    SearchedAt = DateTime.UtcNow
                });
                await _db.SaveChangesAsync();
            }

            return Ok(new { query = q, count = results.Count, results });
        }
    }
}


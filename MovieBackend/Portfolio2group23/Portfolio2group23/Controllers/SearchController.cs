using Microsoft.AspNetCore.Mvc;
using Portfolio2group23.Services;

namespace Portfolio2group23.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly SearchService _service;

        public SearchController(SearchService service)
        {
            _service = service;
        }

        // Accept BOTH /api/search?q=... and /api/search?query=...
        [HttpGet]
        public async Task<IActionResult> Search(
            [FromQuery] string? q,
            [FromQuery] string? query,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            var effectiveQuery = (q ?? query ?? "").Trim();

            int? uid = null;
            if (User?.Identity?.IsAuthenticated == true)
            {
                var claim = User.FindFirst("uid")?.Value;
                if (int.TryParse(claim, out var parsed)) uid = parsed;
            }

            var result = await _service.SearchTitlesPagedAsync(effectiveQuery, uid, page, pageSize, ct);

            // Optional compatibility: if your frontend expects "results" instead of "items"
            return Ok(new
            {
                page = result.Page,
                pageSize = result.PageSize,
                total = result.Total,
                items = result.Items,
                results = result.Items // keeps old UIs working
            });
        }
    }
}

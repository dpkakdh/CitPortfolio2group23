using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio2group23.DTOs;
using Portfolio2group23.Services;

namespace Portfolio2group23.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class RatingsController : ControllerBase
    {
        private readonly RatingService _service;
        public RatingsController(RatingService service) => _service = service;

        [HttpPost]
        public async Task<IActionResult> RateMovie([FromBody] RatingDto dto)
        {
            var uid = int.Parse(User.FindFirst("uid")!.Value);
            var (ok, msg) = await _service.AddOrUpdateRatingAsync(uid, dto);
            if (!ok) return BadRequest(new { error = msg });
            return Ok(new { message = msg });
        }

        // GET /api/ratings/my?page=1&pageSize=20
        [HttpGet("my")]
        public async Task<IActionResult> MyRatings([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var uid = int.Parse(User.FindFirst("uid")!.Value);
            var result = await _service.GetUserRatingsPagedAsync(uid, page, pageSize);
            return Ok(result);
        }

        // DELETE /api/ratings/tt123
        [HttpDelete("{tconst}")]
        public async Task<IActionResult> Remove(string tconst)
        {
            var uid = int.Parse(User.FindFirst("uid")!.Value);
            var (ok, msg) = await _service.RemoveRatingAsync(uid, tconst);
            return ok ? Ok(new { message = msg }) : NotFound(new { error = msg });
        }
    }
}

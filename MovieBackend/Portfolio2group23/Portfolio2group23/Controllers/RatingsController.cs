using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio2group23.Services;
using Portfolio2group23.DTOs;
using System.Security.Claims;

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
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio2group23.Services;
using System.Security.Claims;

namespace Portfolio2group23.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _service;
        public DashboardController(DashboardService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            int uid = int.Parse(User.FindFirst("uid")!.Value);
            var data = await _service.GetDashboardAsync(uid);
            return Ok(new { message = "User dashboard", data });
        }
    }
}


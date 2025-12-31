using Microsoft.AspNetCore.Mvc;
using Portfolio2group23.DataServiceLayer.Data;

namespace Portfolio2group23.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        [HttpGet("test-db")]
        public IActionResult TestDatabase([FromServices] AppDbContext context)
        {
            try
            {
                var canConnect = context.Database.CanConnect();
                return Ok(new { connected = canConnect });
            }
            catch (Exception ex)
            {
                return BadRequest(new { connected = false, error = ex.Message });
            }
        }
    }
}

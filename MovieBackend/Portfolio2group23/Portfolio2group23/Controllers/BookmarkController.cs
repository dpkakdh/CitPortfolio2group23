using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio2group23.DataServiceLayer.Data;
using Portfolio2group23.DataServiceLayer.Models;
using Portfolio2group23.Services;

namespace Portfolio2group23.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class BookmarkController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly BookmarkService _service;

        public BookmarkController(AppDbContext db, BookmarkService service)
        {
            _db = db;
            _service = service;
        }

        [HttpPost("title/{tconst}")]
        public async Task<IActionResult> BookmarkTitle(string tconst)
        {
            int uid = int.Parse(User.FindFirst("uid")!.Value);
            if (await _db.BookmarkTitles.AnyAsync(b => b.UserId == uid && b.Tconst == tconst))
                return BadRequest(new { error = "Already bookmarked" });

            _db.BookmarkTitles.Add(new BookmarkTitle { UserId = uid, Tconst = tconst, CreatedAt = DateTime.UtcNow });
            await _db.SaveChangesAsync();
            return Ok(new { message = "Title bookmarked" });
        }

        [HttpPost("name/{nconst}")]
        public async Task<IActionResult> BookmarkName(string nconst)
        {
            int uid = int.Parse(User.FindFirst("uid")!.Value);
            if (await _db.BookmarkNames.AnyAsync(b => b.UserId == uid && b.Nconst == nconst))
                return BadRequest(new { error = "Already bookmarked" });

            _db.BookmarkNames.Add(new BookmarkName { UserId = uid, Nconst = nconst, CreatedAt = DateTime.UtcNow });
            await _db.SaveChangesAsync();
            return Ok(new { message = "Name bookmarked" });
        }

        // GET /api/bookmark?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetBookmarks([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            int uid = int.Parse(User.FindFirst("uid")!.Value);
            var result = await _service.GetUserBookmarksPagedAsync(uid, page, pageSize);
            return Ok(result);
        }

        // DELETE /api/bookmark/title/tt123
        [HttpDelete("title/{tconst}")]
        public async Task<IActionResult> RemoveTitle(string tconst)
        {
            int uid = int.Parse(User.FindFirst("uid")!.Value);
            var ok = await _service.RemoveTitleBookmarkAsync(uid, tconst);
            return ok ? Ok(new { message = "Title bookmark removed" }) : NotFound(new { error = "Bookmark not found" });
        }

        // DELETE /api/bookmark/name/nm123
        [HttpDelete("name/{nconst}")]
        public async Task<IActionResult> RemoveName(string nconst)
        {
            int uid = int.Parse(User.FindFirst("uid")!.Value);
            var ok = await _service.RemoveNameBookmarkAsync(uid, nconst);
            return ok ? Ok(new { message = "Name bookmark removed" }) : NotFound(new { error = "Bookmark not found" });
        }
    }
}

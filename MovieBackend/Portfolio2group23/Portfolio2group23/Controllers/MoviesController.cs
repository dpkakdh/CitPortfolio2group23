using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio2group23.DataServiceLayer.Data;
using Portfolio2group23.Services;

namespace Portfolio2group23.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MoviesController(AppDbContext db)
        {
            _db = db;
        }


        // Standard projection (ALL fields)
        private static object ProjectMovie(dynamic o) => new
        {
            tconst = (string)o.Tconst,
            title = (string?)o.Title,
            year = (string?)o.Year,
            type = (string?)o.Type,
            plot = (string?)o.Plot,
            posterUrl = (string?)o.Poster,
            genre = (string?)o.Genre,
            actors = (string?)o.Actors,
            director = (string?)o.Director,
            writer = (string?)o.Writer,
            imdbRating = (string?)o.ImdbRating,
            imdbVotes = (string?)o.ImdbVotes,
            metascore = (string?)o.Metascore
        };

        // -----------------------------
        // GET /api/movies?limit=60&offset=0
        // List endpoint (FAST)
        // -----------------------------
        [HttpGet]
        public async Task<IActionResult> GetMovies(
            [FromQuery] int limit = 60,
            [FromQuery] int offset = 0,
            CancellationToken ct = default)
        {
            limit = Math.Clamp(limit, 1, 200);
            offset = Math.Max(offset, 0);

            var baseQuery = _db.OmdbData
                .AsNoTracking()
                .Where(o => o.Poster != null && o.Poster != "N/A");

            var total = await baseQuery.CountAsync(ct);



            var rows = await baseQuery
                // SQL-translatable ordering: handles "1959–1964", null, etc.
                .OrderByDescending(o => o.Year != null && o.Year.Length >= 4 ? o.Year.Substring(0, 4) : "0000")
                .ThenBy(o => o.Title)
                .Skip(offset)
                .Take(limit)
                .Select(o => new
                {
                    o.Tconst,
                    o.Title,
                    o.Year,
                    o.Type,
                    o.Plot,
                    o.Poster,
                    o.Genre,
                    o.Actors,
                    o.Director,
                    o.Writer,
                    o.ImdbRating,
                    o.ImdbVotes,
                    o.Metascore,
                    
                })
                .ToListAsync(ct);

            var results = rows.Select(ProjectMovie).ToList();
            return Ok(new { total, limit, offset, results });
        }

        // -----------------------------
        // GET /api/movies/search?q=batman&limit=60&offset=0
        // -----------------------------
        [HttpGet("search")]
        public async Task<IActionResult> Search(
            [FromQuery] string q,
            [FromQuery] int limit = 60,
            [FromQuery] int offset = 0,
            CancellationToken ct = default)
        {
            q = (q ?? "").Trim();
            if (q.Length == 0)
                return Ok(new { total = 0, limit, offset, results = new List<object>() });

            limit = Math.Clamp(limit, 1, 200);
            offset = Math.Max(offset, 0);

            var baseQuery = _db.OmdbData
                .AsNoTracking()
                .Where(o => o.Title != null && EF.Functions.ILike(o.Title, $"%{q}%"))
                .Where(o => o.Poster != null && o.Poster != "N/A");

            var total = await baseQuery.CountAsync(ct);

            var rows = await baseQuery
                .OrderByDescending(o => o.Year != null && o.Year.Length >= 4 ? o.Year.Substring(0, 4) : "0000")
                .ThenBy(o => o.Title)
                .Skip(offset)
                .Take(limit)
                .Select(o => new
                {
                    o.Tconst,
                    o.Title,
                    o.Year,
                    o.Type,
                    o.Plot,
                    o.Poster,
                    o.Genre,
                    o.Actors,
                    o.Director,
                    o.Writer,
                    o.ImdbRating,
                    o.ImdbVotes,
                    o.Metascore
                })
                .ToListAsync(ct);

            var results = rows.Select(ProjectMovie).ToList();
            return Ok(new { total, limit, offset, results });
        }

        // -----------------------------
        // GET /api/movies/tt1234567?includeCast=true
        // Details endpoint (movie + cast avatars in ONE response)
        // -----------------------------
        [HttpGet("{tconst:regex(^tt\\d+$)}")]
        public async Task<IActionResult> GetById(
            string tconst,
            [FromServices] TmdbService tmdb,
            [FromQuery] bool includeCast = true,
            CancellationToken ct = default)
        {
            tconst = (tconst ?? "").Trim();

            // First try exact match
            var movie = await _db.OmdbData
                .AsNoTracking()
                .Where(o => o.Tconst == tconst)
                .Select(o => new
                {
                    o.Tconst,
                    o.Title,
                    o.Year,
                    o.Type,
                    o.Plot,
                    o.Poster,
                    o.Genre,
                    o.Actors,
                    o.Director,
                    o.Writer,
                    o.ImdbRating,
                    o.ImdbVotes,
                    o.Metascore
                })
                .FirstOrDefaultAsync(ct);

            // If your DB has trailing spaces in Tconst, this fallback usually works with Npgsql
            if (movie == null)
            {
                movie = await _db.OmdbData
                    .AsNoTracking()
                    .Where(o => o.Tconst != null && o.Tconst.Trim() == tconst)
                    .Select(o => new
                    {
                        o.Tconst,
                        o.Title,
                        o.Year,
                        o.Type,
                        o.Plot,
                        o.Poster,
                        o.Genre,
                        o.Actors,
                        o.Director,
                        o.Writer,
                        o.ImdbRating,
                        o.ImdbVotes,
                        o.Metascore
                    })
                    .FirstOrDefaultAsync(ct);
            }

            if (movie == null) return NotFound();

            if (!includeCast)
                return Ok(ProjectMovie((dynamic)movie));

            // Try best practice first: IMDb -> TMDB mapping -> credits (movie or tv)
            var cast = await tmdb.GetCastForImdbAsync(tconst, take: 10, ct);

            // Fallback for unreleased/unmapped titles: actor-name search (avatars still show)
            if (cast.Count == 0)
                cast = await tmdb.GetCastFromActorNamesAsync(movie.Actors, take: 10, ct);

            return Ok(new
            {
                tconst = movie.Tconst,
                title = movie.Title,
                year = movie.Year,
                type = movie.Type,
                plot = movie.Plot,
                posterUrl = movie.Poster,
                genre = movie.Genre,
                actors = movie.Actors,
                director = movie.Director,
                writer = movie.Writer,
                imdbRating = movie.ImdbRating,
                imdbVotes = movie.ImdbVotes,
                metascore = movie.Metascore,
                castImages = cast,
            });
        }

        // GET /api/movies/tt1234567/cast-images
        [HttpGet("{tconst:regex(^tt\\d+$)}/cast-images")]
        public async Task<IActionResult> GetCastImages(
            string tconst,
            [FromServices] TmdbService tmdb,
            CancellationToken ct = default)
        {
            tconst = (tconst ?? "").Trim();

            var cast = await tmdb.GetCastForImdbAsync(tconst, take: 10, ct);
            if (cast.Count == 0)
            {
                // Optional: fallback here too (needs OMDb actors)
                var actors = await _db.OmdbData
                    .AsNoTracking()
                    .Where(o => o.Tconst == tconst)
                    .Select(o => o.Actors)
                    .FirstOrDefaultAsync(ct);

                cast = await tmdb.GetCastFromActorNamesAsync(actors, take: 10, ct);
            }

            return Ok(new { tconst, cast });
        }

        // GET /api/movies/person/{name}
        [HttpGet("person/{name}")]
        public async Task<IActionResult> GetPerson(
            string name,
            [FromServices] TmdbService tmdb,
            CancellationToken ct = default)
        {
            name = (name ?? "").Trim();
            if (name.Length == 0) return BadRequest("Name is required.");

            var person = await tmdb.SearchPersonAsync(name, ct);
            if (person == null) return NotFound();

            return Ok(person);
        }
    }
}

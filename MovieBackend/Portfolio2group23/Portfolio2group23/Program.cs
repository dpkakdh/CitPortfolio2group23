using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Portfolio2group23.DataServiceLayer.Data;
using Portfolio2group23.Middlewares;
using Portfolio2group23.Services;
using System.Text;

namespace Portfolio2group23
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Controllers
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            // Database
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // AutoMapper
            builder.Services.AddAutoMapper(typeof(MappingProfile));

            // CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            //Tmdb API 
            var tmdbApiKey = builder.Configuration["Tmdb:ApiKey"];

            if (string.IsNullOrEmpty(tmdbApiKey))
                throw new Exception("TMDB API key missing");
            
            builder.Services.AddHttpClient<TmdbService>();


            //MemoryCache
            builder.Services.AddMemoryCache();




            // JWT
            var jwtKey = builder.Configuration["Jwt:Key"];
            if (string.IsNullOrWhiteSpace(jwtKey))
                throw new Exception("Jwt:Key is missing in configuration.");

            var key = Encoding.ASCII.GetBytes(jwtKey);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
            });

            // DI Services
            builder.Services.AddScoped<Portfolio2group23.Services.MovieService>();
            builder.Services.AddScoped<Portfolio2group23.Services.RatingService>();
            builder.Services.AddScoped<Portfolio2group23.Services.SearchService>();
            builder.Services.AddScoped<Portfolio2group23.Services.BookmarkService>();
            builder.Services.AddScoped<Portfolio2group23.Services.DashboardService>();

            var app = builder.Build();

            try
            {
                if (!app.Environment.IsDevelopment())
                {
                    app.UseExceptionHandler("/Error");
                    app.UseHsts();
                }

                app.UseHttpsRedirection();
                app.UseRouting();

                app.UseMiddleware<ErrorMiddleware>();

                app.UseCors("AllowFrontend");

                app.UseAuthentication();
                app.UseAuthorization();

                app.MapControllers();

                // Health check
                app.MapGet("/", async (AppDbContext db, TmdbService tmdb) =>
                {
                    // Counts
                    var usersCount = await db.Users.CountAsync();
                    var moviesCount = await db.OmdbData.CountAsync();
                    var ratingsCount = await db.Ratings.CountAsync();
                    var bookmarksCount = await db.BookmarkTitles.CountAsync();

                    var namesCount = await db.Names.CountAsync();
                    var knownForCount = await db.KnownForTitles.CountAsync();

                    // Pick a "good" sample movie (has poster + actors)
                    var sampleMovie = await db.OmdbData
                        .AsNoTracking()
                        .Where(o =>
                            o.Poster != null && o.Poster != "N/A" &&
                            o.Actors != null && o.Actors != "N/A" &&
                            o.Title != null && o.Title != "N/A")
                        .OrderBy(o => o.Tconst) // deterministic
                        .Select(o => new
                        {
                            o.Tconst,
                            o.Title,
                            o.Year,
                            o.ImdbRating,
                            o.ImdbVotes,
                            o.Metascore,
                            PosterUrl = o.Poster,
                            Actors = o.Actors
                        })
                        .FirstOrDefaultAsync();

                    // Fetch cast images from TMDB (top 3 actors to avoid rate limits)
                    var castImages = new List<object>();

                    if (sampleMovie != null)
                    {
                        var actorNames = (sampleMovie.Actors ?? "")
                            .Split(',')
                            .Select(s => s.Trim())
                            .Where(s => !string.IsNullOrWhiteSpace(s) && s != "N/A")
                            .Take(3)
                            .ToList();

                        foreach (var actorName in actorNames)
                        {
                            var person = await tmdb.SearchPersonAsync(actorName);

                            castImages.Add(new
                            {
                                name = actorName,
                                tmdbId = person?.Id,
                                avatarUrl = person?.ProfileUrl // requires the TmdbPerson model to expose ProfileUrl
                            });
                        }
                    }

                    return Results.Ok(new
                    {
                        status = "OK",
                        database = "Connected",
                        counts = new
                        {
                            users = usersCount,
                            movies = moviesCount,
                            ratings = ratingsCount,
                            bookmarks = bookmarksCount,
                            names = namesCount,
                            knownFor = knownForCount
                        },
                        sample = sampleMovie == null ? null : new
                        {
                            sampleMovie.Tconst,
                            sampleMovie.Title,
                            sampleMovie.Year,
                            sampleMovie.ImdbRating,
                            sampleMovie.ImdbVotes,
                            sampleMovie.Metascore,
                            sampleMovie.PosterUrl,
                            cast = castImages
                        }
                    });
                });


                app.Run();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Application failed to start: {ex}");
                throw;
            }
        }
    }
}

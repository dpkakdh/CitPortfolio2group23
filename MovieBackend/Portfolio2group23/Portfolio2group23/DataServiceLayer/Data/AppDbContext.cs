using Microsoft.EntityFrameworkCore;
using Portfolio2group23.DataServiceLayer.Models;

namespace Portfolio2group23.DataServiceLayer.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // ===== DbSets =====
        public DbSet<User> Users { get; set; }
        public DbSet<BookmarkTitle> BookmarkTitles { get; set; }
        public DbSet<BookmarkName> BookmarkNames { get; set; }

        public DbSet<Rating> Ratings { get; set; }
        public DbSet<RatingHistory> RatingHistories { get; set; }
        public DbSet<SearchHistory> SearchHistories { get; set; }

        public DbSet<Title> Titles { get; set; }
        public DbSet<Name> Names { get; set; }

        public DbSet<Principal> Principals { get; set; }
        public DbSet<TitleRating> TitleRatings { get; set; }

        public DbSet<Genre> Genres { get; set; }
        public DbSet<GenreList> GenreLists { get; set; }

        public DbSet<TitleAka> TitleAkas { get; set; }
        public DbSet<TitleCrew> TitleCrews { get; set; }
        public DbSet<Episode> Episodes { get; set; }

        public DbSet<KnownForTitle> KnownForTitles { get; set; }
        public DbSet<Profession> Professions { get; set; }
        public DbSet<NameProfession> NameProfessions { get; set; }

        public DbSet<NameRating> NameRatings { get; set; }

        // OMDb extension table (posters/plot)
        public DbSet<OmdbData> OmdbData { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ===== Users / App tables =====
            modelBuilder.Entity<User>().ToTable("users");

            modelBuilder.Entity<BookmarkTitle>()
                .HasOne(b => b.User)
                .WithMany(u => u.BookmarkTitles)
                .HasForeignKey(b => b.UserId);

            modelBuilder.Entity<BookmarkTitle>()
                .HasOne(b => b.Title)
                .WithMany(t => t.BookmarkTitles)
                .HasForeignKey(b => b.Tconst);

            modelBuilder.Entity<BookmarkName>()
                .HasOne(b => b.User)
                .WithMany(u => u.BookmarkNames)
                .HasForeignKey(b => b.UserId);

            modelBuilder.Entity<BookmarkName>()
                .HasOne(b => b.Name)
                .WithMany(n => n.BookmarkNames)
                .HasForeignKey(b => b.Nconst);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.User)
                .WithMany(u => u.Ratings)
                .HasForeignKey(r => r.UserId);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.Title)
                .WithMany(t => t.Ratings)
                .HasForeignKey(r => r.Tconst);

            modelBuilder.Entity<RatingHistory>()
                .HasOne(rh => rh.User)
                .WithMany(u => u.RatingHistories)
                .HasForeignKey(rh => rh.UserId);

            modelBuilder.Entity<RatingHistory>()
                .HasOne(rh => rh.Title)
                .WithMany(t => t.RatingHistories)
                .HasForeignKey(rh => rh.Tconst);

            modelBuilder.Entity<SearchHistory>()
                .HasOne(sh => sh.User)
                .WithMany(u => u.SearchHistories)
                .HasForeignKey(sh => sh.UserId);

            // ===== Name ratings (1-1) =====
            modelBuilder.Entity<NameRating>()
                .HasKey(nr => nr.Nconst);

            modelBuilder.Entity<NameRating>()
                .HasOne(nr => nr.Name)
                .WithOne(n => n.NameRating)
                .HasForeignKey<NameRating>(nr => nr.Nconst);

            // ===== Principals (composite PK) =====
            modelBuilder.Entity<Principal>()
                .HasKey(p => new { p.Nconst, p.Tconst, p.Ordering });

            modelBuilder.Entity<Principal>()
                .HasOne(p => p.Title)
                .WithMany(t => t.Principals)
                .HasForeignKey(p => p.Tconst);

            modelBuilder.Entity<Principal>()
                .HasOne(p => p.Name)
                .WithMany(n => n.Principals)
                .HasForeignKey(p => p.Nconst);

            // ===== Title ratings (1-1) =====
            modelBuilder.Entity<TitleRating>()
                .HasKey(tr => tr.Tconst);

            modelBuilder.Entity<TitleRating>()
                .HasOne(tr => tr.Title)
                .WithOne(t => t.TitleRating)
                .HasForeignKey<TitleRating>(tr => tr.Tconst);

            // ===== Genres (many-to-many through GenreList) =====
            modelBuilder.Entity<GenreList>()
                .HasKey(gl => new { gl.Tconst, gl.GenreId });

            modelBuilder.Entity<GenreList>()
                .HasOne(gl => gl.Title)
                .WithMany(t => t.GenreLists)
                .HasForeignKey(gl => gl.Tconst);

            modelBuilder.Entity<GenreList>()
                .HasOne(gl => gl.Genre)
                .WithMany(g => g.GenreLists)
                .HasForeignKey(gl => gl.GenreId);

            // ===== Title crew (1-1) =====
            modelBuilder.Entity<TitleCrew>()
                .HasKey(tc => tc.Tconst);

            modelBuilder.Entity<TitleCrew>()
                .HasOne(tc => tc.Title)
                .WithOne(t => t.TitleCrew)
                .HasForeignKey<TitleCrew>(tc => tc.Tconst);

            // ===== Episodes (episode -> parent title) =====
            modelBuilder.Entity<Episode>()
                .HasKey(e => e.Tconst);

            modelBuilder.Entity<Episode>()
                .HasOne(e => e.ParentTitle)
                .WithMany(t => t.Episodes)
                .HasForeignKey(e => e.ParentTconst);

            // ===== Known-for (composite) =====
            modelBuilder.Entity<KnownForTitle>()
                .HasKey(k => new { k.Nconst, k.Tconst });

            modelBuilder.Entity<KnownForTitle>()
                .HasOne(k => k.Title)
                .WithMany(t => t.KnownForTitles)
                .HasForeignKey(k => k.Tconst);

            modelBuilder.Entity<KnownForTitle>()
                .HasOne(k => k.Name)
                .WithMany(n => n.KnownForTitles)
                .HasForeignKey(k => k.Nconst);

            // ===== Name professions (composite) =====
            modelBuilder.Entity<NameProfession>()
                .HasKey(np => new { np.Nconst, np.ProfessionId });

            modelBuilder.Entity<NameProfession>()
                .HasOne(np => np.Name)
                .WithMany(n => n.NameProfessions)
                .HasForeignKey(np => np.Nconst);

            modelBuilder.Entity<NameProfession>()
                .HasOne(np => np.Profession)
                .WithMany(p => p.NameProfessions)
                .HasForeignKey(np => np.ProfessionId);

            // ===== Title AKA (IMPORTANT FIX: composite PK) =====
            modelBuilder.Entity<TitleAka>()
                .HasKey(a => new { a.Tconst, a.Ordering });

            // ===== OMDb data (1-1 with Title) =====
            modelBuilder.Entity<OmdbData>()
                .HasKey(o => o.Tconst);

            modelBuilder.Entity<OmdbData>()
                .HasOne(o => o.TitleNav)
                .WithOne(t => t.OmdbData)
                .HasForeignKey<OmdbData>(o => o.Tconst);
        }
    }
}
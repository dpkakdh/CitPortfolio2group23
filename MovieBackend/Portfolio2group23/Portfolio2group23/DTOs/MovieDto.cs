namespace Portfolio2group23.DTOs
{
    public class MovieDto
    {
        public string Tconst { get; set; } = "";
        public string Title { get; set; } = "";
        public int? StartYear { get; set; }

        // IMDb rating
        public double? AverageRating { get; set; }
        public int? NumVotes { get; set; }

        // OMDb
        public string? PosterUrl { get; set; }

        // User-specific
        public bool IsBookmarked { get; set; }
        public int? UserRating { get; set; }
    }
}

namespace Portfolio2group23.DTOs
{
    public class MovieDetailsDto
    {
        public string Tconst { get; set; } = "";
        public string Title { get; set; } = "";
        public string? OriginalTitle { get; set; }

        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
        public int? RuntimeMinutes { get; set; }

        public double? AverageRating { get; set; }
        public int? NumVotes { get; set; }

        public string? Plot { get; set; }
        public string? PosterUrl { get; set; }

        public List<string> Genres { get; set; } = new();
        public List<CastDto> Cast { get; set; } = new();

        public bool IsBookmarked { get; set; }
        public int? UserRating { get; set; }
    }

    public class CastDto
    {
        public string Nconst { get; set; } = "";
        public string Name { get; set; } = "";
        public string Category { get; set; } = "";
        public string? Characters { get; set; }
        public int Ordering { get; set; }
    }
}

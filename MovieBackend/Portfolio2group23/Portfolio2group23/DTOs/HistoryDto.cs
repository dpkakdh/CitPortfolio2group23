using System;

namespace Portfolio2group23.DTOs
{
    public class SearchHistoryItemDto
    {
        public int Id { get; set; }
        public string Query { get; set; } = "";
        public int ResultsCount { get; set; }
        public DateTime SearchedAt { get; set; }
    }

    public class RatingItemDto
    {
        public string Tconst { get; set; } = "";
        public int Value { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class RatingHistoryItemDto
    {
        public int Id { get; set; }
        public string Tconst { get; set; } = "";
        public int Value { get; set; }
        public DateTime ChangedAt { get; set; }
    }
}

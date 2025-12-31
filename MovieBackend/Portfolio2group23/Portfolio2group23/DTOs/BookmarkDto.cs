namespace Portfolio2group23.DTOs
{
    public class BookmarkDto
    {
        public string Code { get; set; } = ""; // tconst or nconst
        public string Type { get; set; } = ""; // "title" or "name"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

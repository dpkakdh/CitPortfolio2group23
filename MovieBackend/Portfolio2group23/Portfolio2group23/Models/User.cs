using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required, Column("username")]
        public string Username { get; set; } = null!;

        [Required, Column("email")]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required, Column("password_hash")]
        public string PasswordHash { get; set; } = null!;

        [Column("full_name")]
        public string FullName { get; set; } = null!;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Initialize collections to avoid 400 errors
        public ICollection<BookmarkTitle> BookmarkTitles { get; set; } = new List<BookmarkTitle>();
        public ICollection<BookmarkName> BookmarkNames { get; set; } = new List<BookmarkName>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
        public ICollection<RatingHistory> RatingHistories { get; set; } = new List<RatingHistory>();
        public ICollection<SearchHistory> SearchHistories { get; set; } = new List<SearchHistory>();
    }
}

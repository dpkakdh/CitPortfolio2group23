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
        public string Username { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Required, Column("password_hash")]
        public string PasswordHash { get; set; }

        [Column("full_name")]
        public string FullName { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<BookmarkTitle> BookmarkTitles { get; set; }
        public ICollection<BookmarkName> BookmarkNames { get; set; }
        public ICollection<Rating> Ratings { get; set; }
        public ICollection<RatingHistory> RatingHistories { get; set; }
        public ICollection<SearchHistory> SearchHistories { get; set; }
    }
}

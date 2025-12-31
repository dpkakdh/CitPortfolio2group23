using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("rating_history")]
    public class RatingHistory
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public int UserId { get; set; }

        [ForeignKey("Title")]
        [Column("tconst")]
        public string Tconst { get; set; }

        [Column("rating")]
        public int Value { get; set; }

        [Column("changed_at")]
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        [Column("rating_value")]
        public double RatingValue { get; set; }

        [Column("rated_at")]
        public DateTime RatedAt { get; set; } = DateTime.UtcNow;


        public User User { get; set; }
        public Title Title { get; set; }
    }
}

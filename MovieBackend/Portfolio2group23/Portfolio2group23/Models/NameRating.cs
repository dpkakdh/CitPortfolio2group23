using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("name_ratings")]
    public class NameRating
    {
        [Key]
        [Column("nconst")]
        public string Nconst { get; set; }

        [Column("averagerating")]
        public double AverageRating { get; set; }

        [Column("numvotes")]
        public int NumVotes { get; set; }

        [Column("last_updated")]
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        public Name Name { get; set; }
    }
}

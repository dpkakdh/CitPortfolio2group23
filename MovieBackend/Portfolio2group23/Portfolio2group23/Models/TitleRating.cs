using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("titleratings")]
    public class TitleRating
    {
        [Key]
        [Column("tconst")]
        public string Tconst { get; set; }

        [Column("averagerating")]
        public double AverageRating { get; set; }

        [Column("numvotes")]
        public int NumVotes { get; set; }

        public Title Title { get; set; }
    }
}
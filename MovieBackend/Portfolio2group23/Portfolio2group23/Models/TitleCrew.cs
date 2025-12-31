using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("titlecrew")]
    public class TitleCrew
    {
        [Key]
        [Column("tconst")]
        public string Tconst { get; set; }

        [Column("directors")]
        public string Directors { get; set; }

        [Column("writers")]
        public string Writers { get; set; }

        public Title Title { get; set; }
    }
}

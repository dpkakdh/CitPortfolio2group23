using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("titleakas")]
    public class TitleAka
    {
        
        [Column("ordering")]
        public int Ordering { get; set; }

        [Column("tconst")]
        public string Tconst { get; set; }

        [Column("title")]
        public string Title { get; set; }

        [Column("region")]
        public string Region { get; set; }

        [Column("language")]
        public string Language { get; set; }

        [Column("types")]
        public string Types { get; set; }

        [Column("attributes")]
        public string Attributes { get; set; }

        [Column("isoriginaltitle")]
        public bool IsOriginalTitle { get; set; }
    }
}
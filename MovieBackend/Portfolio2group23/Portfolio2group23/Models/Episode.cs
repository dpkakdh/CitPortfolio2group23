using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("episode")]
    public class Episode
    {
        [Key]
        [Column("tconst")]
        public string Tconst { get; set; }

        [Column("parenttconst")]
        public string ParentTconst { get; set; }

        [Column("seasonnumber")]
        public int? SeasonNumber { get; set; }

        [Column("episodenumber")]
        public int? EpisodeNumber { get; set; }

        public Title ParentTitle { get; set; }
    }
}

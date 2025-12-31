using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("genrelist")]
    public class GenreList
    {
        [Key, Column("tconst", Order = 0)]
        public string Tconst { get; set; }

        [Key, Column("genreid", Order = 1)]
        public int GenreId { get; set; }

        public Title Title { get; set; }
        public Genre Genre { get; set; }
    }
}


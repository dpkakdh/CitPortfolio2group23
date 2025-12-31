using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("genres")]
    public class Genre
    {
        [Key]
        [Column("genreid")]
        public int GenreId { get; set; }

        [Column("genrename")]
        public string GenreName { get; set; }

        public ICollection<GenreList> GenreLists { get; set; }
    }
}
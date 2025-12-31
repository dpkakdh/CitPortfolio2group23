using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("omdb_data")]
    public class OmdbData
    {
        [Key]
        [Column("tconst")]
        public string Tconst { get; set; } = null!;

        [Column("title")]
        public string? Title { get; set; }

        [Column("year")]
        public string? Year { get; set; }

        [Column("type")]
        public string? Type { get; set; }

        [Column("plot")]
        public string? Plot { get; set; }

        [Column("genre")]
        public string? Genre { get; set; }

        [Column("actors")]
        public string? Actors { get; set; }

        [Column("director")]
        public string? Director { get; set; }

        [Column("writer")]
        public string? Writer { get; set; }

        [Column("poster")]
        public string? Poster { get; set; }

        [Column("imdbrating")]
        public string? ImdbRating { get; set; }

        [Column("imdbvotes")]
        public string? ImdbVotes { get; set; }

        [Column("metascore")]
        public string? Metascore { get; set; }


        // Navigation (1-1 with Title)
        public Title? TitleNav { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("title")]
    public class Title
    {
        [Key]
        [Column("tconst")]
        public string Tconst { get; set; }

        [Column("titletype")]
        public string TitleType { get; set; }

        [Column("primarytitle")]
        public string PrimaryTitle { get; set; }

        [Column("originaltitle")]
        public string OriginalTitle { get; set; }

        [Column("isadult")]
        public bool IsAdult { get; set; }

        [Column("startyear")]
        public int? StartYear { get; set; }

        [Column("endyear")]
        public int? EndYear { get; set; }

        [Column("runtimeminutes")]
        public int? RuntimeMinutes { get; set; }





        // Navigation
        public ICollection<Principal> Principals { get; set; }
        public ICollection<GenreList> GenreLists { get; set; }
        public ICollection<Episode> Episodes { get; set; }
        public ICollection<KnownForTitle> KnownForTitles { get; set; }

        public TitleRating TitleRating { get; set; }
        public TitleCrew TitleCrew { get; set; }

        // App features
        public ICollection<BookmarkTitle> BookmarkTitles { get; set; }
        public ICollection<Rating> Ratings { get; set; }
        public ICollection<RatingHistory> RatingHistories { get; set; }

        // Optional: OMDb extension (poster/plot)
        public OmdbData OmdbData { get; set; }
    }
}
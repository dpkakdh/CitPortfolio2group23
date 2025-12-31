using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("name")]
    public class Name
    {
        [Key]
        [Column("nconst")]
        public string Nconst { get; set; }

        [Column("primaryname")]
        public string PrimaryName { get; set; }

        [Column("birthyear")]
        public string BirthYear { get; set; }

        [Column("deathyear")]
        public string DeathYear { get; set; }

        public ICollection<Principal> Principals { get; set; }
        public ICollection<KnownForTitle> KnownForTitles { get; set; }
        public ICollection<BookmarkName> BookmarkNames { get; set; }
        public ICollection<NameProfession> NameProfessions { get; set; }

        public NameRating NameRating { get; set; }
    }
}
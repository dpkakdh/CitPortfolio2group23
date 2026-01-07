using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Linq;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("knownfortitles")]
    public class KnownForTitle
    {
        [Key, Column("nconst", Order =0)]
        public string Nconst { get; set; }

        [Key, Column("tconst", Order = 1)]
        public string Tconst { get; set; }

        public Name Name { get; set; }
        public Title Title { get; set; }
    } 
}

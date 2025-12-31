using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("principals")]
    public class Principal
    {
        [Key, Column("tconst", Order = 0)]
        public string Tconst { get; set; }

        [Key, Column("ordering", Order = 1)]
        public int Ordering { get; set; }

        [Key, Column("nconst", Order = 2)]
        public string Nconst { get; set; }

        [Column("category")]
        public string Category { get; set; }

        [Column("job")]
        public string Job { get; set; }

        [Column("characters")]
        public string Characters { get; set; }

        public Title Title { get; set; }
        public Name Name { get; set; }
    }
}
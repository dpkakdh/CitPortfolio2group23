using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("nameprofessions")]
    public class NameProfession
    {
        [Key, Column("nconst", Order = 0)]
        public string Nconst { get; set; }

        [Key, Column("professionid", Order = 1)]
        public int ProfessionId { get; set; }

        public Name Name { get; set; }
        public Profession Profession { get; set; }
    }
}

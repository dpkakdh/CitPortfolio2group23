using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("professions")]
    public class Profession
    {
        [Key]
        [Column("professionid")]
        public int ProfessionId { get; set; }

        [Column("professionname")]
        public string ProfessionName { get; set; }

        public ICollection<NameProfession> NameProfessions { get; set; }
    }
}

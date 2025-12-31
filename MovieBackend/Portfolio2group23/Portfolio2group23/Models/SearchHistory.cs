using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio2group23.DataServiceLayer.Models
{
    [Table("search_history")]
    public class SearchHistory
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        // ✅ supports "Query" and "SearchQuery"
        [Column("search_query")]
        public string SearchQuery { get; set; } = string.Empty;

        [NotMapped]
        public string Query
        {
            get => SearchQuery;
            set => SearchQuery = value;
        }

        // ✅ supports both "SearchedAt" and "SearchTime"
        [Column("search_time")]
        public DateTime SearchTime { get; set; } = DateTime.UtcNow;

        [NotMapped]
        public DateTime SearchedAt
        {
            get => SearchTime;
            set => SearchTime = value;
        }

        // ✅ number of results returned
        [Column("results_count")]
        public int ResultsCount { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }
    }
}

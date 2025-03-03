using System.ComponentModel.DataAnnotations;

namespace api.Models {
    public class Raffle {
        public int Id { get; set; }

        [Required]
        public required string WinnerName { get; set; }

        [Required]
        public int WinnerTickets { get; set; }

        [Required]
        public required DateOnly Date { get; set; }
    }
}

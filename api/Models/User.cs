using System.ComponentModel.DataAnnotations;

namespace api.Models {
    public class User {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }
        
        [Required]
        public required string Email { get; set; }
        
        [Required]
        public required string Mobile { get; set; }

        [Required]
        public int Tickets { get; set; }

        [Required]
        public required AccessPassword PasswordUsed { get; set; }
    }
}

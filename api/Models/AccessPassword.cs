using System.ComponentModel.DataAnnotations;

namespace api.Models {
    public class AccessPassword {
        public int Id { get; set; }

        [Required]
        public string Value { get; set; }

        [Required]
        public string Role { get; set; }
    }
}

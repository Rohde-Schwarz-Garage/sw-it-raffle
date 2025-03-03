using System.ComponentModel.DataAnnotations;

namespace api.Dto {
    public class CreateUserRequest {
        public string Name { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [Phone]
        public string Mobile { get; set; }
    }
}

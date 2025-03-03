namespace api.Dto {
    public class UserRoleResult {
        public string Role { get; set; }

        public UserRoleResult(string role) {
            Role = role;
        }
    }
}

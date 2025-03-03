using System.Security.Cryptography;

namespace api.Utils {
    public class RandomPassword {
        public static string Create(int length) {
            using var rng = RandomNumberGenerator.Create();
            byte[] data = new byte[length];

            rng.GetBytes(data);
            return BitConverter.ToString(data).Replace("-", "").ToLower();
        }
    }
}

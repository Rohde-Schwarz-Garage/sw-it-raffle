using api.Data;
using api.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace api.Filters {
    public class PasswordAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions> {
        private readonly DatabaseContext _context;


        public PasswordAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options, 
            ILoggerFactory logger, 
            UrlEncoder encoder, 
            ISystemClock clock,
            DatabaseContext context
        ) : base(options, logger, encoder, clock) {
            _context = context;
        }


        protected override async Task<AuthenticateResult> HandleAuthenticateAsync() {
            if (!Request.Headers.ContainsKey("Authorization")) return AuthenticateResult.Fail("Missing Authorization Header");

            var authHeader = AuthenticationHeaderValue.Parse(Request.Headers.Authorization);
            if (!authHeader.Scheme.Equals("Bearer", StringComparison.OrdinalIgnoreCase)) {
                return AuthenticateResult.Fail("Invalid Authorization Scheme");
            }

            AccessPassword? pw = await GetPassword(authHeader.Parameter);
            if (pw == null) return AuthenticateResult.Fail("Invalid Password");

            var claims = new[] {
                 new Claim(ClaimTypes.Name, pw.Id.ToString()),
                 new Claim(ClaimTypes.Role, pw.Role)
            };

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }

        private async Task<AccessPassword?> GetPassword(string? password) {
            if (string.IsNullOrEmpty(password)) return null;

            try {
                return await _context.AccessPasswords.Where(pw => pw.Value.Equals(password)).FirstOrDefaultAsync();
            } catch {
                return null;
            }
        }
    }
}

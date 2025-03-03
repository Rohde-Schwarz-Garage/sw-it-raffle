using api.Auth;
using api.Data;
using api.Dto;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace api.Controllers {
    [Route("api/v1/[controller]")]
    [Authorize(Roles = RaffleRole.Both)]
    [ApiController]
    public class UsersController : ControllerBase {
        private readonly ILogger<UsersController> _logger;
        private readonly DatabaseContext _context;
        private readonly JsonFile<WelcomePage> _welcomePage;


        public UsersController(ILogger<UsersController> logger, DatabaseContext context, JsonFile<WelcomePage> welcomePage) {
            _logger = logger;
            _context = context;
            _welcomePage = welcomePage;
        }


        [HttpGet("PasswordUsed")]
        public async Task<ObjectResult> PasswordUsed() {
            int pwId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value);
            bool userExists = await _context.Users.Where(u => u.PasswordUsed.Id == pwId).AnyAsync();
            return Ok(new BooleanResult(userExists));
        }

        [HttpGet("CheckRole")]
        public async Task<ObjectResult> CheckRole() {
            string pwId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value; // This won't be null
            AccessPassword pw = await _context.AccessPasswords.FindAsync(int.Parse(pwId));
            return Ok(new UserRoleResult(pw.Role));
        }

        [HttpPost("CreateUser")]
        [Authorize(Roles = RaffleRole.User)]
        public async Task<ObjectResult> CreateUser([FromBody] CreateUserRequest request) {
            string pwId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value; // This won't be null
            AccessPassword pw = await _context.AccessPasswords.FindAsync(int.Parse(pwId));
            User? user = await _context.Users.Where(u => u.PasswordUsed == pw).FirstOrDefaultAsync();
            if (user != null) return Conflict("That password has already been used to create a user");

            User newUser = new() { Name = request.Name, Email = request.Email, Mobile = request.Mobile, Tickets = 1, PasswordUsed = pw };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Created();
        }

        [HttpGet("GetWelcomePage")]
        public ObjectResult GetWelcomePage() {
            return _welcomePage.Data != null ? Ok(_welcomePage.Data) : NotFound("Welcome Page is empty");
        }
    }
}

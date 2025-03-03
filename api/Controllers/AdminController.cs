using api.Auth;
using api.Data;
using api.Dto;
using api.Models;
using api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers {

    [Route("api/v1/[controller]")]
    [Authorize(Roles = RaffleRole.Admin)]
    [ApiController]
    public class AdminController : ControllerBase {
        private readonly ILogger<AdminController> _logger;
        private readonly DatabaseContext _context;
        private readonly JsonFile<WelcomePage> _welcomePage;


        public AdminController(ILogger<AdminController> logger, DatabaseContext context, JsonFile<WelcomePage> welcomePage) {
            _logger = logger;
            _context = context;
            _welcomePage = welcomePage;
        }


        [HttpPost("CreatePassword")]
        public async Task<AccessPassword> CreatePassword() {
            string value = RandomPassword.Create(8);

            AccessPassword pw = new() { Value = value, Role = RaffleRole.User };
            _context.AccessPasswords.Add(pw);
            await _context.SaveChangesAsync();

            return pw;
        }

        [HttpGet("GetPasswords")]
        public async Task<ObjectResult> GetPasswords() {
            var query = _context.AccessPasswords
            .Where(ap => ap.Role == RaffleRole.User)
            .GroupJoin(_context.Users,
                ap => ap.Id,
                u => u.PasswordUsed.Id,
                (ap, userGroup) => new { ap, userGroup }
            ).SelectMany(
                x => x.userGroup.DefaultIfEmpty(),
                (x, ug) => new {
                    AccessPassword = x.ap,
                    IsUsed = ug != null
                }
            ).ToList();
            return Ok(query);
        }

        [HttpDelete("DeletePassword")]
        public async Task<StatusCodeResult> DeletePassword([FromBody] IdentifiedByIdRequest request) {
            int rowsAffected = await _context.AccessPasswords.Where(ap => ap.Id == request.Id).ExecuteDeleteAsync();
            return rowsAffected == 0 ? NotFound() : NoContent();
        }

        [HttpGet("GetUsers")]
        public Task<List<User>> GetUsers() {
            return _context.Users.Include(u => u.PasswordUsed).ToListAsync();
        }

        [HttpDelete("DeleteUser")]
        public async Task<StatusCodeResult> DeleteUser([FromBody] IdentifiedByIdRequest request) {
            int rowsAffected = await _context.Users.Where(user => user.Id == request.Id).ExecuteDeleteAsync();
            return rowsAffected == 0 ? NotFound() : NoContent();
        }

        [HttpPatch("UpdateTicketCount")]
        public async Task<StatusCodeResult> UpdateTicketCount([FromBody] UpdateTicketCountRequest request) {
            User? user = await _context.Users.FindAsync(request.Id);
            if (user == null) return NotFound();

            user.Tickets = request.Tickets;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("StartRaffle")]
        public async Task<ObjectResult> StartRaffle() {
            List<User> users = await _context.Users.Where(u => u.Tickets > 0).ToListAsync();
            if (users.Count == 0) return BadRequest("No users have more than 0 tickets");

            int totalTickets = users.Sum(u => u.Tickets);
            int winningTicket = new Random().Next(totalTickets);

            User winner = users.First();
            int ticketCount = 0;

            foreach (User user in users) {
                ticketCount += user.Tickets;

                if (ticketCount >= winningTicket) {
                    winner = user;
                    break;
                }
            }

            Raffle raffle = new() { WinnerName = winner.Name, WinnerTickets = winner.Tickets, Date = DateOnly.FromDateTime(DateTime.Now) };
            _context.Raffles.Add(raffle);
            _context.SaveChanges();

            return Ok(raffle);
        }

        [HttpGet("GetRaffles")]
        public async Task<ObjectResult> GetRaffles() {
            return Ok(await _context.Raffles.ToListAsync());
        }

        [HttpDelete("DeleteRaffle")]
        public async Task<StatusCodeResult> DeleteRaffle([FromBody] IdentifiedByIdRequest request) {
            int rowsAffected = await _context.Raffles.Where(raffle => raffle.Id == request.Id).ExecuteDeleteAsync();
            return rowsAffected == 0 ? NotFound() : NoContent();
        }

        [HttpPatch("UpdateWelcomePage")]
        public ObjectResult UpdateWelcomePage([FromBody] WelcomePage request) {
            if (!string.IsNullOrEmpty(request.Title)) _welcomePage.Data.Title = request.Title;
            if (!string.IsNullOrEmpty(request.Description)) _welcomePage.Data.Description = request.Description;
            if (!string.IsNullOrEmpty(request.Image)) _welcomePage.Data.Image = request.Image;
            _welcomePage.Save();

            return Ok(_welcomePage.Data);
        }
    }
}

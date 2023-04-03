using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EssoDotnetCoreWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly string _secret;
        private readonly IMongoDbContext _dbContext;

        public AuthController(IConfiguration config, IMongoDbContext dbContext)
        {
            _secret = config.GetValue<string>("Jwt:Key");
            _dbContext = dbContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto login)
        {
            try
            {
                var collection = _dbContext.Database.GetCollection<User>("users");
                var user = collection.Find(u => u.Username == login.Username).FirstOrDefault();
                if (user == null)
                {
                    return BadRequest(new { message = "ไม่พบ Username" });
                }

                if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
                {
                    return BadRequest(new { message = "รหัสผ่านไม่ถูกต้อง" });
                }
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_secret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[] { new Claim("username", user.Username) }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);
                return Ok(new { Token = tokenString, User = user });

            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
        private bool ValidateCredentials(string username, string password)
        {
            var collection = _dbContext.Database.GetCollection<User>("users");
            var user = collection.Find(u => u.Username == username).FirstOrDefault();

            if (user == null)
            {
                return false;
            }

            return BCrypt.Net.BCrypt.Verify(password, user.Password);
        }

    }

    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}

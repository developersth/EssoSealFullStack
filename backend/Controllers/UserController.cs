using System.Net;
using DnsClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EssoDotnetCoreWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMongoDbContext _dbContext;
        public UserController(IMongoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IEnumerable<User>> Get()
        {
            var collection = _dbContext.Database.GetCollection<User>("users");
            var filter = Builders<User>.Filter.Empty;
            var users = await collection.Find(filter).ToListAsync();
            return users;
        }

        [HttpGet("{id}")]
        public async Task<IEnumerable<User>> GetById(string id)
        {
            try
            {
                var collection = _dbContext.Database.GetCollection<User>("users");
                var objectId = new ObjectId(id);
                var filter = Builders<User>.Filter.Eq(u => u.Id, objectId);
                var _user = collection.Find(filter).ToList();
                if (_user != null)
                {
                    return _user;
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] User user)
        {
            var collection = _dbContext.Database.GetCollection<User>("users");

            user.Password = HashPassword(user.Password);
            var filter = Builders<User>.Filter.Eq(u => u.Username, user.Username);
            var _user = await collection.Find(filter).FirstOrDefaultAsync();
            if (_user != null)
            {
                return BadRequest("มีผู้ใช้งานนี้แล้ว");
            }

            await collection.InsertOneAsync(user);
            return Ok(user);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] User user)
        {
            var collection = _dbContext.Database.GetCollection<User>("users");
            ObjectId objectId = new ObjectId(id);
            var filter = Builders<User>.Filter.Eq(u => u.Id, objectId);
            var _user = await collection.Find(filter).FirstOrDefaultAsync();
            if (_user != null)
            {
                return NotFound();
            }

            await collection.ReplaceOneAsync(filter, user);
            return Ok(user);
        }
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}

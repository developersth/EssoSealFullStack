using System.Net.Http;
using System;
using System.Net;
using System.Xml.Linq;
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
            try
            {
                var collection = _dbContext.Database.GetCollection<User>("users");
                var objectId = new ObjectId(id);
                var filter = Builders<User>.Filter.Eq(x => x.Id, objectId);
                var document = await collection.Find(filter).FirstOrDefaultAsync();
                string password = string.Empty;
                if (!string.IsNullOrEmpty(user.Password))
                    password = HashPassword(user.Password);
                else
                    password = document.Password;

                var dbUser = await collection.FindOneAndUpdateAsync(u => u.Id == objectId, Builders<User>.Update.Set(u => u.Name, user.Name)
                                                                                                                .Set(u => u.Username, user.Username)
                                                                                                                .Set(u => u.Password, password)
                                                                                                                .Set(u => u.Email, user.Email)
                                                                                                                .Set(u => u.IsActive, user.IsActive)
                                                                                                                .Set(u => u.Role.Name, user.Role.Name));

                if (dbUser == null)
                {
                    return NotFound();
                }
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var collection = _dbContext.Database.GetCollection<User>("users");
            var objectId = new ObjectId(id);
            var results = await collection.DeleteOneAsync(u => u.Id == objectId);
            if (results.DeletedCount > 0)
            {
                return NoContent();
            }
            else
            {
                return NotFound();
            }
        }
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}

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
    public class SealInController : ControllerBase
    {
        private readonly IMongoDbContext _dbContext;
        private readonly ILogger<SealInController> _logger;


        public SealInController(IMongoDbContext dbContext, ILogger<SealInController> logger)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        [HttpPost]
        public async Task<IEnumerable<SealIn>> GetAll([FromBody] FilterSealIn filterSealIn)
        {
            var collection = _dbContext.Database.GetCollection<SealIn>("sealin");
            var filter = Builders<SealIn>.Filter.And(
                Builders<SealIn>.Filter.Gte(x => x.CreateAt, filterSealIn.startDate),
                Builders<SealIn>.Filter.Lte(x => x.CreateAt, filterSealIn.endDate)
            );
            var results = await collection.Find(filter).ToListAsync();
            return results;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SealIn>> GetById(string id)
        {
            var _collection = _dbContext.Database.GetCollection<SealIn>("sealin");
            ObjectId _id = new ObjectId(id);
            var filter = Builders<SealIn>.Filter.Eq(d => d.Id, _id);
            var document = await _collection.Find(filter).FirstOrDefaultAsync();

            if (document == null)
            {
                return NotFound();
            }

            return Ok(document);
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Post([FromBody] Seal[] items)
        {
            try
            {
                List<SealIn> list = new List<SealIn>();
                var _item = items;


                var collection = _dbContext.Database.GetCollection<SealIn>("sealin");

                foreach (var item in items)
                {
                    SealIn model = new()
                    {
                        SealNo = item.SealNo,
                        Pack = item.Pack,
                        IsUsed = item.IsUsed
                    };
                    list.Add(model);
                }

                await collection.InsertManyAsync(list);
                return Ok(list);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating seal: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] User user)
        {
            var collection = _dbContext.Database.GetCollection<User>("users");

            var filter = Builders<User>.Filter.Eq(u => u.Id.ToString(), id);
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

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
        public async Task<ActionResult> GetAll([FromBody] FilterSealIn filterSealIn)
        {
            var collection = _dbContext.Database.GetCollection<SealIn>("sealin");
            var filter = Builders<SealIn>.Filter.And(
                Builders<SealIn>.Filter.Gte(x => x.CreateAt, filterSealIn.startDate),
                Builders<SealIn>.Filter.Lte(x => x.CreateAt, filterSealIn.endDate)
            );
            var document = await collection.Find(filter).ToListAsync();
            return Ok(document);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SealIn>> GetById(string id)
        {
            var _collection = _dbContext.Database.GetCollection<SealIn>("sealin");
            //ObjectId _id = new ObjectId(id);
            var filter = Builders<SealIn>.Filter.Eq(d => d.Id, id);
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
        public async Task<IActionResult> Update(string id, [FromBody] SealIn seal)
        {
            var collection = _dbContext.Database.GetCollection<SealIn>("sealin");
            //var objectId = new ObjectId(id);
            var filter = Builders<SealIn>.Filter.Eq(u => u.Id, id);
            var result = await collection.Find(filter).FirstOrDefaultAsync();
            if (result != null)
            {
                return NotFound();
            }


            await collection.ReplaceOneAsync(filter, seal);
            return Ok(seal);

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var collection = _dbContext.Database.GetCollection<SealIn>("sealin");
            //var objectId = new ObjectId(id);
            var results = await collection.DeleteOneAsync(u => u.Id == id);
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

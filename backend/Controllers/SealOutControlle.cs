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
    [ApiController]
    [Route("api/[controller]")]
    public class SealOutController : ControllerBase
    {
        private readonly IMongoDbContext _dbContext;
        private readonly ILogger<SealInController> _logger;


        public SealOutController(IMongoDbContext dbContext, ILogger<SealInController> logger)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

       [HttpGet]
        public async Task<ActionResult<IEnumerable<SealOut>>> GetAll()
        {
            var _collection = _dbContext.Database.GetCollection<SealOut>("sealout");
            var document = await _collection.Find(new BsonDocument()).ToListAsync();
            return Ok(document);
        }
         [HttpGet("{id}")]
        public async Task<ActionResult<SealOut>> GetById(string id)
        {
            var _collection = _dbContext.Database.GetCollection<SealOut>("sealout");
            //var filter = Builders<SealOut>.Filter.Eq(x => "_id", Convert.ToDouble(id));
             var filter = Builders<SealOut>.Filter.Eq(x=>x.Id, ObjectId.Parse(id));
            var document = await _collection.Find(filter).FirstOrDefaultAsync();

            if (document == null)
            {
                return NotFound();
            }

            return Ok(document);
        }


        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SealOut items)
        {
            try
            {
                var collection = _dbContext.Database.GetCollection<SealOut>("sealout");
                await collection.InsertOneAsync(items);
                //updated seal status
                var docs_sealin = _dbContext.Database.GetCollection<SealIn>("sealin");

                foreach (var sealItem in items.SealItem)
                {
                    var objectId = new ObjectId(sealItem.Id);
                    var filter = Builders<SealIn>.Filter.Eq(u => u.Id, objectId);
                    var update = Builders<SealIn>.Update.Set(u => u.IsUsed, true);
                    await docs_sealin.UpdateOneAsync(filter, update);
                }
                return Ok(items);
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
            var objectId = new ObjectId(id);
            var filter = Builders<SealIn>.Filter.Eq(u => u.Id, objectId);
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
            var collection = _dbContext.Database.GetCollection<SealOut>("sealout");
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
    }
}
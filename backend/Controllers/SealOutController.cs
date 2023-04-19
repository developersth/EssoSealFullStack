using System.Collections.Immutable;
using System.Net;
using System.Xml.Linq;
using DnsClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EssoDotnetCoreWebApi.Controllers
{

    [Route("api/sealout")]
    [ApiController]
    public class SealOutControlle : ControllerBase
    {
        private readonly IMongoDbContext _dbContext;
        private readonly ILogger<SealInController> _logger;


        public SealOutControlle(IMongoDbContext dbContext, ILogger<SealInController> logger)
        {
            _logger = logger;
            _dbContext = dbContext;
        }


        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SealOut items)
        {
            try
            {
                var collection = _dbContext.Database.GetCollection<SealOut>("sealout");
                await collection.InsertOneAsync(items);
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

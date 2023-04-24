using System.Net;
using DnsClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Microsoft.Extensions.Logging;
namespace EssoDotnetCoreWebApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrucksController : ControllerBase
    {
        ILogger<TrucksController> _logger { get; set; }
        private readonly IMongoDbContext _dbContext;

        public TrucksController(IMongoDbContext dbContext,ILogger<TrucksController>logger)
        {
            _logger=logger;
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Truck>>> GetAllTrucks()
        {
            var _trucksCollection = _dbContext.Database.GetCollection<Truck>("trucks");
            var trucks = await _trucksCollection.Find(new BsonDocument()).ToListAsync();
            return Ok(trucks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Truck>> GetTruckById(string id)
        {
            var _trucksCollection = _dbContext.Database.GetCollection<Truck>("trucks");
            var truck = await _trucksCollection.Find(t => t.Id == new ObjectId(id)).FirstOrDefaultAsync();
            if (truck == null)
            {
                return NotFound();
            }
            return Ok(truck);
        }

        [HttpPost]
        public async Task<ActionResult<Truck>> CreateTruck(Truck truck)
        {
            try
            {
                var _trucksCollection = _dbContext.Database.GetCollection<Truck>("trucks");
                await _trucksCollection.InsertOneAsync(truck);
                return Ok(new {result = truck,message= "create truck successfully"});
            }
            catch (Exception e)
            {
                _logger.LogError($"Log CreateTruck: {e}");
                return StatusCode(500,new {result = "",message =e});
            }


        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Truck>> UpdateTruck(string id, Truck truck)
        {
            var _trucksCollection = _dbContext.Database.GetCollection<Truck>("trucks");
            var existingTruck = await _trucksCollection.FindOneAndUpdateAsync(
                Builders<Truck>.Filter.Eq(t => t.Id, new ObjectId(id)),
                Builders<Truck>.Update
                    .Set(t => t.TruckIdHead, truck.TruckIdHead)
                    .Set(t => t.TruckIdTail, truck.TruckIdTail),
                new FindOneAndUpdateOptions<Truck> { ReturnDocument = ReturnDocument.After });

            if (existingTruck == null)
            {
                return NotFound();
            }
            return Ok(existingTruck);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTruck(string id)
        {
            var _trucksCollection = _dbContext.Database.GetCollection<Truck>("trucks");
            var result = await _trucksCollection.DeleteOneAsync(t => t.Id == new ObjectId(id));
            if (result.DeletedCount == 0)
            {
                return NotFound();
            }
            return NoContent();
        }
    }

}
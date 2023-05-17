using System.Net;
using System.Xml.Linq;
using DnsClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.IO;


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

        // [HttpGet]
        // public async Task<IActionResult> Get([FromQuery] string pIsActive = "", [FromQuery] string pColumnSearch = "", [FromQuery] string searchTerm = "", [FromQuery] string pStartDate = "", [FromQuery] string pEndDate = "")
        // {
        //     try
        //     {
        //         DateTime startDate = DateTime.Now;
        //         DateTime endDate = DateTime.Now;
        //         searchTerm = searchTerm.Trim();
        //         var _collection = _dbContext.Database.GetCollection<SealIn>("sealin");
        //         var filter = Builders<SealIn>.Filter.And(
        //             Builders<SealIn>.Filter.Gte(x => x.CreateAt, startDate),
        //             Builders<SealIn>.Filter.Lte(x => x.CreateAt, endDate)
        //         );
        //         if (!string.IsNullOrEmpty(searchTerm) && !string.IsNullOrEmpty(pColumnSearch))
        //         {
        //             switch (pColumnSearch)
        //             {
        //                 case "id":
        //                      var id = new ObjectId(searchTerm);
        //                     filter &= Builders<SealIn>.Filter.Eq(x => x.Id, id);
        //                     break;
        //                 case "sealBetween":
        //                     filter &= Builders<SealIn>.Filter.Eq(x => x.SealBetween, searchTerm);
        //                     break;
        //                 case "pack":
        //                     filter &= Builders<SealIn>.Filter.Eq(x => x.Pack, searchTerm);
        //                     break;
        //                 case "sealNo":
        //                     filter &= Builders<SealIn>.Filter.Eq(x => x.SealNo, searchTerm);
        //                     break;
        //                 default:
        //                     return BadRequest("Invalid search column");
        //             }
        //         }


        //         var document = await _collection.Find(filter).ToListAsync();
        //         return Ok(new { result = document, message = "request successfully" });
        //     }
        //     catch (Exception error)
        //     {
        //         _logger.LogError($"Log GetSealIn: {error}");
        //         return StatusCode(500, new { result = "", message = error });
        //     }

        // }
        [HttpPost]
        public async Task<ActionResult> GetAll([FromBody] FindDateSeal findDate)
        {
            var collection = _dbContext.Database.GetCollection<SealIn>("sealin");
            var filter = Builders<SealIn>.Filter.And(
                Builders<SealIn>.Filter.Gte(x => x.CreateAt, findDate.startDate),
                Builders<SealIn>.Filter.Lte(x => x.CreateAt, findDate.endDate)
            );

            var document = await collection.Find(filter).ToListAsync();
            return Ok(document);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<SealIn>> GetById(string id)
        {
            var _collection = _dbContext.Database.GetCollection<SealIn>("sealin");
            var filter = Builders<SealIn>.Filter.Eq(x => x.Id.Increment, Convert.ToDouble(id));
            var document = await _collection.Find(filter).FirstOrDefaultAsync();

            if (document == null)
            {
                return NotFound();
            }

            return Ok(document);
        }
        [HttpGet("pdf")]
        public IActionResult GetPdfReport()
        {
            MemoryStream stream = new MemoryStream();
            Document pdfDoc = new Document(PageSize.A4, 25f, 25f, 30f, 30f);
            PdfWriter writer = PdfWriter.GetInstance(pdfDoc, stream);

            pdfDoc.Open();
            pdfDoc.Add(new Paragraph("Hello World!"));
            pdfDoc.Close();

            byte[] content = stream.ToArray();
            MemoryStream ms = new MemoryStream(content);
            //return File(content, "application/pdf", "report.pdf");
            return new FileStreamResult(ms, "application/pdf");
        }
        [HttpGet("GetSealNo")]
        public async Task<ActionResult<SealIn>> GetSealNo()
        {
            var _collection = _dbContext.Database.GetCollection<SealIn>("sealin");
            var filter = Builders<SealIn>.Filter.Eq(x => x.IsUsed, false);
            var document = await _collection.Find(filter).ToListAsync();

            if (document == null)
            {
                return NotFound();
            }

            return Ok(document);
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Post([FromBody] SealIn[] items)
        {
            try
            {
                List<SealIn> list = new List<SealIn>();
                // List<SealNoItems> listSeal = new List<SealNoItems>();
                var _item = items;
                var collection = _dbContext.Database.GetCollection<SealIn>("sealin");
                var sealNoItem_colection = _dbContext.Database.GetCollection<SealNoItems>("SealNoItem");
                foreach (var item in items)
                {
                    // foreach (var seal in item.SealNoItem)
                    // {
                    //     var sealModel = new SealNoItems()
                    //     {
                    //         SealNo = seal.SealNo,
                    //         Type = 1,
                    //         IsUsed = false,
                    //         Status = 1
                    //     };
                    //     listSeal.Add(sealModel);
                    // }

                    SealIn model = new()
                    {
                        SealBetween = item.SealBetween,
                        SealNoItem = item.SealNoItem,
                        Pack = item.Pack,
                        IsUsed = item.IsUsed
                    };
                    list.Add(model);
                    //add Seal

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

        [HttpDelete("delete-all")]
        public async Task<IActionResult> Delete(SealIn[] items)
        {
            var collection = _dbContext.Database.GetCollection<SealIn>("sealin");
            try
            {
                foreach (var item in items)
                {
                    var filter = Builders<SealIn>.Filter.Eq(item => item.Id, new ObjectId(item._id));
                    var results = await collection.DeleteOneAsync(filter);
                }
                return NoContent();
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var collection = _dbContext.Database.GetCollection<SealIn>("sealin");
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

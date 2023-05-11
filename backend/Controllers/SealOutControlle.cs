using System;
using System.Net;
using System.Xml.Linq;
using DnsClient;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Microsoft.AspNetCore.Hosting;
using AspNetCore.Reporting;
using System.Text;
using System.Data;
using Amazon.Runtime.Internal.Util;
using System.Drawing;
//using Microsoft.Reporting.WebForms;

namespace EssoDotnetCoreWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SealOutController : ControllerBase
    {
        private readonly IMongoDbContext _dbContext;
        private readonly ILogger<SealInController> _logger;
        private readonly IWebHostEnvironment _env;


        public SealOutController(IMongoDbContext dbContext, ILogger<SealInController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _dbContext = dbContext;
            _env = env;
            //IReport = iServiceReport;
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
            var filter = Builders<SealOut>.Filter.Eq(x => x.Id, ObjectId.Parse(id));
            var document = await _collection.Find(filter).FirstOrDefaultAsync();

            if (document == null)
            {
                return NotFound();
            }

            return Ok(document);
        }

        //[HttpGet]
        //[Route("export-data")]
        //public ActionResult Export_Data()
        //{

        //    var byteRes = new byte[] { };
        //    string path = _env.WebRootPath + "\\Reports\\Report.rdlc";
        //    byteRes = ReportService.CreateReportFile(path);

        //    return File(byteRes,
        //        System.Net.Mime.MediaTypeNames.Application.Octet,
        //        "ReportName.pdf");
        //}


        [HttpGet]
        [Route("showrececeipt/{id}")]
        public async Task<ActionResult> ShowReport(string id)
        {
            try
            {
                var byteRes = new byte[] { };
                string path = $"{_env.WebRootPath}\\Reports\\rptReceipt.rdlc";
                Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
                LocalReport report = new LocalReport(path);
                DataTable dt =await GenDataReceipt(id);
                report.AddDataSource("dsSealOut",dt);
                // Render the report to a byte array
                var result =  report.Execute(RenderType.Pdf, 1);
                var stream = new MemoryStream(result.MainStream);
                stream.Seek(0, SeekOrigin.Begin);
                return  new FileStreamResult(stream, "application/pdf");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error showrececeipt : {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        private async Task<DataTable> GenDataReceipt(string id) 
        {
            DataTable dt = new DataTable("tmp");
            // Add some columns to the table
            dt.Columns.Add("id", typeof(string));
            dt.Columns.Add("sealTotal", typeof(int));
            dt.Columns.Add("sealTotalExtra", typeof(int));
            dt.Columns.Add("truckLicense", typeof(string));
            dt.Columns.Add("sealNo", typeof(string));
            dt.Columns.Add("createAtSt", typeof(string));
            dt.Columns.Add("pack", typeof(int));
            dt.Columns.Add("number", typeof(int));
            dt.Columns.Add("type", typeof(string));

            var _collection = _dbContext.Database.GetCollection<SealOut>("sealout");
            var filter = Builders<SealOut>.Filter.Eq(x => x.Id, ObjectId.Parse(id));
            var document = await _collection.Find(filter).ToListAsync();
            if (document != null)
            {
                foreach (var item in document)
                {
                    int number = 1;
                    foreach (var sealItem in item.SealItem)
                    {
          
                        foreach (var sealNoItem in sealItem.SealNoItem)
                        {

                            dt.Rows.Add(
                                item._id,
                                (item.SealTotal+item.SealTotalExtra),
                                item.SealTotalExtra,
                                item.TruckLicense,
                                sealNoItem.SealNo,
                                item.CreateAtStr,
                                sealItem.Pack,
                                number,
                                sealItem.Type);
                            number++;
                        }
                    }
                    foreach (var sealItemExtra in item.SealItemExtra)
                    {
                        if (sealItemExtra.SealNoItem == null)
                            break;
                        foreach (var sealNoItem in sealItemExtra.SealNoItem)
                        {

                            dt.Rows.Add(
                                item._id,
                                item.SealTotal + item.SealTotalExtra,
                                item.SealTotalExtra,
                                item.TruckLicense,
                                sealNoItem.SealNo,
                                item.CreateAtStr,
                                1,
                                number,
                                sealItemExtra.Type);
                            number++;
                        }
                    }

                }
            }
            return dt;
        }
   
        [HttpPost("FindAll")]
        public async Task<ActionResult> GetAll([FromBody] FindDateSeal findDate)
        {
            var collection = _dbContext.Database.GetCollection<SealOut>("sealout");
            var filter = Builders<SealOut>.Filter.And(
                Builders<SealOut>.Filter.Gte(x => x.CreateAt, findDate.startDate),
                Builders<SealOut>.Filter.Lte(x => x.CreateAt, findDate.endDate)
            );

            var document = await collection.Find(filter).ToListAsync();
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
        public async Task<IActionResult> Update(string id, [FromBody] SealOut seal)
        {
            try
            {
                var collection = _dbContext.Database.GetCollection<SealOut>("sealout");
                var objectId = new ObjectId(id);

                var result = await collection.FindOneAndUpdateAsync(
                Builders<SealOut>.Filter.Eq(t => t.Id, new ObjectId(id)),
                Builders<SealOut>.Update
                    .Set(t => t.SealTotal, seal.SealTotal)
                    .Set(t => t.SealItemExtra, seal.SealItemExtra)
                    .Set(t => t.SealTotalExtra, seal.SealTotalExtra)
                    .Set(t => t.TruckId, seal.TruckId)
                    .Set(t => t.TruckLicense, seal.TruckLicense)
                    .Set(t => t.SealItem, seal.SealItem)
                    .Set(t => t.SealItemExtra, seal.SealItemExtra),
                new FindOneAndUpdateOptions<SealOut> { ReturnDocument = ReturnDocument.After });

                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                _logger.LogError($"Error update seal: {ex.Message}");
                return StatusCode(500, ex.Message);
            }

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
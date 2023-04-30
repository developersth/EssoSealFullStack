using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Globalization;

namespace EssoDotnetCoreWebApi
{
    public class Truck
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
        public string _id { get { return Id.ToString(); } }
        public string? TruckIdHead { get; set; }
        public string? TruckIdTail { get; set; }
        public int? FixSeal { get; set; } = 0;
        public DateTime CreateAt { get; set; } =  DateTime.UtcNow;
        public string CreateAtStr
        {
            get
            {
                TimeZoneInfo tzInfo = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); // ใช้ timezone ของ local machine
                DateTime localDateTime = TimeZoneInfo.ConvertTimeFromUtc(CreateAt, tzInfo);
                return localDateTime.ToString("dd/MM/yyyy HH:mm:ss", new CultureInfo("en-US"));
            }
        }
        public DateTime LastUpdateAt { get; set; } = DateTime.Now;
    }
}
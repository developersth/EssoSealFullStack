using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json.Nodes;
using System;
using System.Globalization;
namespace EssoDotnetCoreWebApi
{
    public class Seal
    {
        public string Id { get; set; }

        public string? SealNo { get; set; }

        public int? Pack { get; set; }

        public bool? IsUsed { get; set; }

    }
    public class SealIn
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        public string _id { get { return Id.ToString(); } }

        public string SealBetween { get; set; }
        public List<SealNoItems>? SealNoItem { get; set; }
        public string name { get { return SealBetween; } }

        public int? Pack { get; set; }

        public bool? IsUsed { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
        public string CreateAtStr
        {
            get
            {
                TimeZoneInfo tzInfo = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); // ใช้ timezone ของ local machine
                DateTime localDateTime = TimeZoneInfo.ConvertTimeFromUtc(CreateAt, tzInfo);
                return localDateTime.ToString("dd/MM/yyyy HH:mm:ss", new CultureInfo("en-US"));
            }
        }
        public DateTime LastUpdateAt { get; set; } = DateTime.UtcNow;
        //public CustomId CustomId { get; set; }

    }
    public class SealOut
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        public string _id { get { return Id.ToString(); } }
        public int SealTotal { get; set; }
        public int SealTotalExtra { get; set; }

        public string? TruckId { get; set; }
        public string? TruckLicense { get; set; }

        public List<SealItem>? SealItem { get; set; }

        public List<SealItem>? SealItemExtra { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
        public string CreateAtStr
        {
            get
            {
                TimeZoneInfo tzInfo = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); // ใช้ timezone ของ local machine
                DateTime localDateTime = TimeZoneInfo.ConvertTimeFromUtc(CreateAt, tzInfo);
                return localDateTime.ToString("dd/MM/yyyy HH:mm:ss", new CultureInfo("en-US"));
            }
        }
        public DateTime LastUpdateAt { get; set; } = DateTime.UtcNow;
        public string LastUpdateAtStr
        {
            get
            {
                TimeZoneInfo tzInfo = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); // ใช้ timezone ของ local machine
                DateTime localDateTime = TimeZoneInfo.ConvertTimeFromUtc(LastUpdateAt, tzInfo);
                return localDateTime.ToString("dd/MM/yyyy HH:mm:ss", new CultureInfo("en-US"));
            }
        }

    }
    public class SealItem
    {
        public string? Id { get; set; }
        public string? SealBetween { get; set; }
        public List<SealNoItems>? SealNoItem { get; set; }
        public int? Pack { get; set; }
        public string? Type { get; set; }
    }
    public class SealNoItems
    {
        public string? SealNo { get; set; }
        public bool IsUsed { get; set; } = false;
    }

}

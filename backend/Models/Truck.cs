using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
namespace EssoDotnetCoreWebApi
{
    public class Truck
    {
        public ObjectId Id { get; set; }
        public string _id { get { return Id.ToString(); } }
        public string? TruckIdHead { get; set; }
        public string? TruckIdTail { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string CreateAtStr
        {
            get
            {
                return CreateAt.ToString("dd/MM/yyyy HH:mm:ss", new System.Globalization.CultureInfo("en-US"));
            }
        }
        public DateTime LastUpdateAt { get; set; } = DateTime.Now;
    }
}
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json.Nodes;

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
        public string? SealNo { get; set; }

        public int? Pack { get; set; }

        public bool? IsUsed { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string CreateAtStr
        {
            get
            {
                return CreateAt.ToString("dd/MM/yyyy HH:mm:ss", new System.Globalization.CultureInfo("en-US"));
            }
        }
        public DateTime LastUpdateAt { get; set; } = DateTime.Now;
        //public CustomId CustomId { get; set; }

    }



}

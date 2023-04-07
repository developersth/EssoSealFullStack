using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json.Nodes;

namespace EssoDotnetCoreWebApi
{
    public class Seal
    {
        public string? SealNo { get; set; }

        public int? Pack { get; set; }

        public bool? IsUsed { get; set; }

    }
    public class SealIn
    {
        public ObjectId Id { get; set; }

        public string? SealNo { get; set; }

        public int? Pack { get; set; }

        public bool? IsUsed { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;
        public DateTime LastUpdateAt { get; set; } = DateTime.Now;

    }

}

using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json.Nodes;

namespace EssoDotnetCoreWebApi
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string? Username { get; set; }

        public string? Password { get; set; }

        public string? Name { get; set; }

        public string? Email { get; set; }
        public bool? IsActive { get; set; }
        public Roles? Role { get; set; }
    }
    public class Roles
    {
        public string? Name { get; set; }
    }
    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}

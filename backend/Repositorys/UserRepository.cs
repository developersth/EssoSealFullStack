using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EssoDotnetCoreWebApi
{

    public class UserRepository
    {
        private readonly IMongoCollection<User> _users;
        public UserRepository(IMongoClient client)
        {
            var database = client.GetDatabase("admin");
            _users = database.GetCollection<User>("users");
        }

        public async Task Post(User user)
        {
            await _users.InsertOneAsync(user);
        }

        public async Task<IEnumerable<User>> Get()
        {
            var list = await _users.Find(new BsonDocument()).ToListAsync();
            return list;
        }
        public async Task<User> GetById(string id)
        {
            var objectId = new ObjectId(id);
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            return await _users.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<User> GetByUsername(string username)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Username, username);
            return await _users.Find(filter).FirstOrDefaultAsync();
        }

        public async Task Update(User user)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, user.Id);
            await _users.ReplaceOneAsync(filter, user);
        }
    }

}

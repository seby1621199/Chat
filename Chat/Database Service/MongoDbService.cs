using Chat.Model;
using MongoDB.Bson;
using MongoDB.Driver;

public class MongoDbService
{
    private readonly IMongoCollection<BsonDocument> _messagesCollection;

    public MongoDbService(string connectionString, string databaseName, string collectionName)
    {
        var client = new MongoClient(connectionString);
        var database = client.GetDatabase(databaseName);
        _messagesCollection = database.GetCollection<BsonDocument>(collectionName);
    }

    public List<ChatMessage> GetLastMessages(int count)
    {
        try
        {
            var messages = _messagesCollection
                .Find(new BsonDocument())
                .SortByDescending(message => message["Timestamp"])
                .Limit(count)
                .ToList();

            var result = new List<ChatMessage>();
            foreach (var message in messages)
            {
                result.Add(new ChatMessage
                {
                    Id = message["_id"].ToString(),
                    Username = message["Username"].AsString,
                    Message = message["Message"].AsString,
                    Color = message["Color"].AsString,
                    Timestamp = message["Timestamp"].ToUniversalTime()
                });
            }

            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving last messages: {ex.Message}");
            return new List<ChatMessage>();
        }
    }

    public async Task SaveMessageAsync(ChatMessage chatMessage)
    {
        try
        {
            var bsonDocument = new BsonDocument
            {
                { "_id", ObjectId.GenerateNewId() },
                { "Username", chatMessage.Username },
                { "Message", chatMessage.Message },
                { "Color", chatMessage.Color },
                { "Timestamp", chatMessage.Timestamp }
            };

            await _messagesCollection.InsertOneAsync(bsonDocument);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving message: {ex.Message}");
        }
    }
}
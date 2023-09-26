using MongoDB.Bson;
using MongoDB.Driver;
using Server.DataStructure;

namespace Server.DataAccessLayer
{
    public static class Database
    {
        private static MongoClient m_Client = new MongoClient("mongodb+srv://bank:Drept1234!@cluster0.zwmtb.mongodb.net/Cluster0?retryWrites=true&w=majority");
        private static IMongoDatabase m_Database = m_Client.GetDatabase("chat");
        private static IMongoCollection<Message> m_Collection = m_Database.GetCollection<Message>("messages");
        public static void AddMessage(string username, string text)
        {
            m_Collection.InsertOne(new Message(username, text));
        }

        internal static IEnumerable<object> GetLastMessages()
        {
            var messages = m_Collection.Find(new BsonDocument())
                .SortByDescending(message => message.Time)
                .Limit(5)
                .ToList();

            messages.Reverse();

            return messages; 
        }

    }
}

using MongoDB.Bson;
using Newtonsoft.Json;

namespace Server.DataStructure
{
    public class Message
    {
        [JsonProperty("_id")]
        public ObjectId Id { get; set; }
        public string Username { get; set; }
        public string Text { get; set; }
        public DateTime Time { get; set; }
        public Message(string Username, string Text)
        {
            this.Username = Username;
            this.Text = Text;
            this.Time = DateTime.Now;
        }

    }
}

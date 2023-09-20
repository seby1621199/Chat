namespace Server.DataStructure
{
     public class Message
    {
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

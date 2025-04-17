namespace Chat.Model;

public class ChatMessage
{
    public string Id { get; set; }
    public string Username { get; set; }
    public string Message { get; set; }
    public string Color { get; set; }
    public DateTime Timestamp { get; set; }
}
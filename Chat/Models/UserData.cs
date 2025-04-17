namespace Chat.Models;

public class UserData
{
    public string ConnectionId { get; set; }
    public string Color { get; set; }

    public UserData(string connectionId, string color)
    {
        ConnectionId = connectionId;
        Color = color;
    }
}

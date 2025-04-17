
using Chat.Model;
using Chat.Models;
using Microsoft.AspNetCore.SignalR;

namespace Chat.Hubs;

public class ChatHub : Hub
{
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly MongoDbService _mongoDbService;
    private static readonly DictionaryUsers _users = new DictionaryUsers();
    private static readonly Random _random = new Random();

    public ChatHub(IHubContext<ChatHub> hubContext, MongoDbService mongoDbService)
    {
        _hubContext = hubContext;
        _mongoDbService = mongoDbService;
        _users.DictionaryModified += DictionaryModified;
    }

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
        try
        {
            var lastMessages = _mongoDbService.GetLastMessages(5);
            await Clients.Caller.SendAsync("ReceiveLastMessages", lastMessages);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in OnConnectedAsync: {ex.Message}");
        }
        var connectionId = Context.ConnectionId;
        var userEntry = _users.FirstOrDefault(x => x.Value.ConnectionId == connectionId);
        if (!string.IsNullOrEmpty(userEntry.Key))
        {
            await Clients.Caller.SendAsync("ValidateUsernameResponse", true);
        }
        else
        {
            await Clients.Caller.SendAsync("ValidateUsernameResponse", false);
        }
    }



    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var connectionId = Context.ConnectionId;

        var userEntry = _users.FirstOrDefault(x => x.Value.ConnectionId == connectionId);
        if (!string.IsNullOrEmpty(userEntry.Key))
        {
            _users.Remove(userEntry.Key);
        }
        var usernames = _users.Select(u => u.Key).ToList();
        await Clients.All.SendAsync("ReceiveAllUsernames", usernames);

        await base.OnDisconnectedAsync(exception);
    }

    private async void DictionaryModified(object? sender, EventArgs e)
    {
        await SendUsersListToAll();
    }

    private string GenerateRandomColor()
    {
        return $"#{_random.Next(0x1000000):X6}";
    }

    public async Task SendPrivateMessage(string targetUsername, string message)
    {
        if (_users.TryGetValue(targetUsername, out var userData))
        {
            var senderUsername = _users.FirstOrDefault(x => x.Value.ConnectionId == Context.ConnectionId).Key;
            await Clients.Client(userData.ConnectionId).SendAsync("ReceivePrivateMessage", senderUsername, message);
        }
    }

    public async Task SendUsersListToAll()
    {
        var usersList = _users.Select(u => new
        {
            Username = u.Key,
            Color = u.Value.Color
        }).ToList();

        await _hubContext.Clients.All.SendAsync("ConnectedUsers", usersList);
    }

    [HubMethodName("SetUsername")]
    public async Task SetUsername(string username)
    {
        var connectionId = Context.ConnectionId;
        var color = GenerateRandomColor();
        var userEntry = _users.FirstOrDefault(x => x.Key == username);
        if (userEntry.Value == null)
        {
            await Clients.Caller.SendAsync("ValidateUsernameResponse", true);
        }
        else
        {
            await Clients.Caller.SendAsync("ValidateUsernameResponse", false);
            return;
        }
        _users.Add(username, connectionId, color);

        await SendUsersListToAll();

        var usernames = _users.Select(u => u.Key).ToList();
        await Clients.All.SendAsync("ReceiveAllUsernames", usernames);
    }

    public async Task SendAllUsernames()
    {
        var usernames = _users.Select(u => u.Key).ToList();
        await Clients.Caller.SendAsync("ReceiveAllUsernames", usernames);
    }

    public async Task SendMessageToAll(string message)
    {
        var username = _users.FirstOrDefault(x => x.Value.ConnectionId == Context.ConnectionId).Key;
        if (!string.IsNullOrEmpty(username) && _users.TryGetColor(username, out var color))
        {
            var chatMessage = new ChatMessage
            {
                Username = username,
                Message = message,
                Color = color,
                Timestamp = DateTime.UtcNow
            };

            await _mongoDbService.SaveMessageAsync(chatMessage);

            await Clients.All.SendAsync("ReceiveMessage", username, message, color);
        }
    }
}
using Microsoft.AspNetCore.SignalR;
using Server.DataAccessLayer;
using Server.DataStructure;

namespace Server.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IHubContext<ChatHub> _hubContext;
        static DictionaryUsers _users = new DictionaryUsers();

        public ChatHub(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
            _users.DictionaryModified += DictionaryModified;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {

            var connectionId = Context.ConnectionId;

            if (_users.ContainsKey(connectionId))
            {
                string username = _users[connectionId];
                _users.Remove(connectionId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        private async void DictionaryModified(object? sender, EventArgs e)
        {
            await SendUsernamesToAll();
        }

        public async Task SendPrivateMessage(string username, string message)
        {
            var connectionId = _users.FirstOrDefault(pair => pair.Value == username).Key;
            await Clients.Client(connectionId).SendAsync("ReceiveMessage", username, message);
        }


        public async Task SendUsernamesToAll()
        {
            List<string> usernames = _users.Values.ToList();
            await _hubContext.Clients.All.SendAsync("ConnectedUsers", usernames);
        }

        [HubMethodName("SetUsername")]
        public async Task SetUsername(string username)
        {
            var connectionId = Context.ConnectionId;
            _users.Add(connectionId, username);
        }


        public Task SendMessage(string user, string message)
        {
            Task.Run(() => Database.AddMessage(user, message));
            return Clients.All.SendAsync("ReceiveMessage", user, message + " ");
        }
    }
}

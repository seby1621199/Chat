using Client.Data;
using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace Client
{
    /// <summary>
    /// Interaction logic for ChatWindow.xaml
    /// </summary>
    public partial class ChatWindow : Window
    {
        private HubConnection _connection;
        private string _username;

        public ChatWindow()
        {
            InitializeComponent();
            connect();

        }
        void connect()
        {
            configureConnection();
            configureReconnected();
            configureReconnecting();
            configureClosed();
        }
        void configureConnection()
        {
            _connection = new HubConnectionBuilder()
            .WithUrl("https://localhost:7059/chathub")// 7059 //7167
            .WithAutomaticReconnect()
            .Build();
        }
        void configureReconnected()
        {
            _connection.Reconnected += (sender) =>
            {

                this.Dispatcher.Invoke(() =>
                {

                    var newMessage = "Reconnected";
                    messages.Items.Add(newMessage);

                });
                return Task.CompletedTask;
            };
        }



        void configureReconnecting()
        {
            _connection.Reconnecting += (sender) =>
            {
                this.Dispatcher.Invoke(() =>
                {

                    messages.Items.Clear();
                    var newMessage = "Reconnecting";
                    messages.Items.Add(newMessage);

                });
                return Task.CompletedTask;
            };
        }

        void configureClosed()
        {
            _connection.Closed += (sender) =>
            {
                this.Dispatcher.Invoke(() =>
                {

                    var newMessage = "Closed";
                    messages.Items.Add(newMessage);
                    connectButton.IsEnabled = true;
                    sendButton.IsEnabled = false;

                });
                return Task.CompletedTask;
            };
        }

        private async void openConnection_Click(object sender, RoutedEventArgs e)
        {
            _connection.On<string, string>("ReceiveMessage", (user, message) =>
            {
                this.Dispatcher.Invoke(() =>
                {
                    var newMessage = $"{user}: {message}";
                    messages.Items.Add(newMessage);
                });
            });
            _connection.On<List<Message>>("ReceiveLastMessages", (List<Message> m) =>
            {
                this.Dispatcher.Invoke(() =>
                {
                    foreach (var message in m)
                    {
                        var newMessage = $"{message.Username}: {message.Text}";
                        messages.Items.Add(newMessage);
                    }
                });
            });
            _connection.On<List<string>>("ConnectedUsers", (List<string> users) =>
            {
                this.Dispatcher.Invoke(() =>
                {
                    usersList.Items.Clear();
                    foreach (var user in users)
                    {
                        var newMessage = $"{user}";
                        usersList.Items.Add(newMessage);
                    }
                });
            });

            try
            {
                await _connection.StartAsync();
                messages.Items.Add("Connection Started");
                if (username.Text != string.Empty)
                {
                    _username = username.Text;
                }
                else
                {
                    Random r = new Random();
                    _username = "user" + r.Next(100, 1000);
                    messages.Items.Add("Username not set, your username: " + _username);
                    usersList.Items.Add(_username);
                }
                await _connection.InvokeAsync("SetUsername", username.Text);
                connectButton.IsEnabled = false;
                sendButton.IsEnabled = true;
            }
            catch (Exception ex)
            {
                messages.Items.Add(ex.Message);
            }

        }

        private void sendMessage_Click(object sender, RoutedEventArgs e)
        {
            send();
        }

        public async void send()
        {
            try
            {
                if (!(inputMessage.Text == string.Empty))
                {
                    await _connection.InvokeAsync("SendMessage", _username, inputMessage.Text);
                    inputMessage.Text = String.Empty;
                }
            }
            catch (Exception ex)
            {
                messages.Items.Add(ex.Message);
            }
        }

        private void Window_KeyDown(object sender, System.Windows.Input.KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                send();
            }
        }
    }
}

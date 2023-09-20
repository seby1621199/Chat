using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace Client
{
    /// <summary>
    /// Interaction logic for PrivateMessage.xaml
    /// </summary>
    public partial class PrivateMessage : Window
    {
        public string _receiver = string.Empty;
        public string _sender = string.Empty;
        private HubConnection _connection;
        public PrivateMessage(string receiver, string sender,HubConnection hub)
        {
            _receiver = receiver;
            _sender = sender;
            _connection = hub;  
            InitializeComponent();
        }

        private async void sendButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                await _connection.InvokeAsync("SendMessage",_sender, inputMessage.Text);
                inputMessage.Text = String.Empty;

            }
            catch (Exception ex)
            {
                privateMessages.Items.Add(ex.Message);
            }
        }
    }
}

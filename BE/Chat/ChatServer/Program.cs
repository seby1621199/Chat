using Microsoft.AspNetCore.SignalR.Client;
using System;

class Program
{
    static void Main(string[] args)
    {
        // Crearea conexiunii către serverul chatului
        var connection = new HubConnectionBuilder()
            .WithUrl("http://localhost:5000/chathub")
            .Build();

        // Înregistrarea metodei pentru a primi mesaje
        connection.On<string, string>("ReceiveMessage", (user, message) =>
        {
            Console.WriteLine($"{user}: {message}");
        });

        // Pornirea conexiunii
        connection.StartAsync().Wait();

        // Introducerea numelui de utilizator
        Console.Write("Username: ");
        var user = Console.ReadLine();

        // Citirea mesajelor și trimiterea lor către server
        while (true)
        {
            Console.Write("Message: ");
            var message = Console.ReadLine();

            connection.InvokeAsync("SendMessage", user, message).Wait();
        }
    }
}

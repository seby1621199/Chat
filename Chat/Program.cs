using Chat.Hubs;
using System.Security.Cryptography.X509Certificates;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSwaggerGen();
}

builder.Services.AddCors(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        options.AddPolicy("DevelopmentPolicy", policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    }
    else
    {
        options.AddPolicy("ProductionPolicy", policy =>
        {
            policy.WithOrigins("https://chat.pavalsebastian.com")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    }
});

if (builder.Environment.IsProduction())
{
    var certPassword = "Drept1234!";
    var certPath = "/etc/letsencrypt/live/chat.pavalsebastian.com/cert.pfx";

    builder.WebHost.ConfigureKestrel(options =>
    {
        var cert = new X509Certificate2(certPath, certPassword);
        options.Listen(System.Net.IPAddress.Any, 5000, listenOptions =>
        {
            listenOptions.UseHttps(cert);
        });
    });
}

builder.Services.AddSignalR();
builder.Services.AddSingleton<MongoDbService>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var connectionString = config["MongoDb:ConnectionString"];
    var databaseName = config["MongoDb:DatabaseName"];
    var collectionName = config["MongoDb:CollectionName"];

    return new MongoDbService(connectionString, databaseName, collectionName);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors(app.Environment.IsDevelopment() ? "DevelopmentPolicy" : "ProductionPolicy");

app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chathub");

app.Run();

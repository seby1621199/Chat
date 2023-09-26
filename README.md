# Chat using SignalR

This project aims to provide an in-depth understanding of WebSocket functionality. It consists of two versions: Desktop (WPF) and WebClient (React).

## Desktop (WPF) Version
In the Desktop version, users can set a custom username. The messages exchanged are stored in a non-relational database (MongoDB), allowing the retrieval of the last 5 messages upon each connection.

### Features
- Username customization.
- Message storage in MongoDB.
- Display of the last 5 messages.
- Built using WPF.

## WebClient Version
The WebClient version has a default username and is built using React, with some styling using MaterialUI for input components.

### Features
- Default username.
- Web-based client.
- React-based UI.
- MaterialUI for styling.

## Server
The server is implemented using the SignalR library in ASP.NET. It includes a special hub for WebSocket communication and a data structure designed to store usernames and session IDs.

### Technologies Used
- SignalR in ASP.NET for WebSocket communication.
- Publisher - Subscriber methodology

### Challenges Faced During Development: 
#### Port Configuration

Google Cloud: Configuring port access in Google Cloud to support WebSocket connections required careful setup and firewall rule adjustments.
Debian Server: Configuring port access on the Debian server for WebSocket communication.
#### Hosting on Linux

Hosting the server component on a Linux environment.
Hosting the web client (built with React) on Linux.
#### Firewall Editing

Editing the firewall settings to allow WebSocket traffic.
#### Subdomain Configuration

Creating a dedicated subdomain for the web client.
Configuring DNS records for the subdomain.
Setting up the web server to handle subdomain requests separately.
Deploying the web client code to the subdomain.
Configuring firewall rules for the subdomain's port.

### Photos
#### Web Client
![WebClient](https://i.imgur.com/SQbzwKh.png)
#### Desktop Client
![DesktopClient](https://i.imgur.com/s6CuwGr.png)
#### DataBase
![DataBase](https://i.imgur.com/ctwVVbw.png)




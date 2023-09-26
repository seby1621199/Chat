# Chat

The purpose of this project is to see how a websocket works.
ChatHub is the publisher to which customers subscribe to send and receive messages.
The advantage of websocket over API and the reason why I chose to use it in this project is that the server can also send messages without the need for the client to make a request.
I used a data structure called DictionaryUsers which is nothing special but a Dictionary<string, string> that has an event handler when the data in it is modified. It is used to manage users and send notifications when a user connects or disconnects to others.

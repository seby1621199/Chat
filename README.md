# Chat App - ASP.NET Core + React

## Overview

- **Back-End**: ASP.NET Core using **SignalR** for real-time WebSocket communication  
- **Front-End**: React.js for the user interface



## Project Structure

- **Back-End (BE)**: ASP.NET Core with SignalR  
- **Front-End (FE)**: React.js



## Implementation Details

The back-end manages connected users through a custom dictionary structure that tracks usernames, connection IDs, and assigned colors. This structure supports adding and removing users, updating user colors, and notifies the system whenever the user list changes.


## Features

- Adding usernames to the active users list  
- Maintaining and displaying a list of active users  
- Showing the last 5 messages in the chat history



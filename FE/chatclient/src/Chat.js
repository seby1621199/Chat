
import * as signalR from "@microsoft/signalr";
import { HubConnectionBuilder } from "@microsoft/signalr";
import './Chat.css';
import React, { Component } from 'react';
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import studentIcon from './icon/student.ico';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            inputMessage: '',
        };


        this.socket = new HubConnectionBuilder()
            .withUrl('http://34.118.23.12:5000/chathub', {   ///http://34.118.23.12:5000/chathub // https://localhost:7059/chathub
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .build();


        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.setState((prevState) => ({
                messages: [...prevState.messages, message],
            }));
        };

        this.socket.onopen = () => {
            console.log('Conectat la serverul de chat');
            this.socket.invoke("SetUsername", "webbb")
                .then(() => {
                    console.log("SetUsername");
                })
                .catch((error) => {
                    console.error('Eroare la apelarea metodei SetUsername:', error);
                });
        };
    }

    componentDidMount() {
        if (this.socket.state === signalR.HubConnectionState.Disconnected) {
            this.socket.start()
                .then(() => {
                    console.log('Conexiune inițiată cu succes');
                    this.socket.invoke("SetUsername", "WebClient")
                        .then(() => {
                            console.log('Metoda SetUsername apelată cu succes');
                        })

                        .catch((error) => {
                            console.error('Eroare la apelarea metodei SetUsername:', error);
                        });
                    
                    this.socket.on("ReceiveMessage", this.receiveMessage);
                    this.socket.on("ReceiveLastMessages", this.processReceivedMessageList);
                })
                .catch((error) => {
                    console.error('Eroare la inițierea conexiunii:', error);
                });
        }
    }


    

    processReceivedMessageList = (receivedMessageList) => {
        const processedMessages = receivedMessageList.map((message) => {
            return {
                user: message.username,
                text: message.text,
                timestamp: message.time.substring(11, 16), 
            };
        });
        this.setState((prevState) => ({
            messages: [...prevState.messages, ...processedMessages],
        }));
    };

    receiveMessage = (user, message) => {
        const now = new Date();
        const oraSiMinutul = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const receivedMessage = {
            user: user,
            text: message,
            timestamp: oraSiMinutul,
        };
        this.setState((prevState) => ({
            messages: [...prevState.messages, receivedMessage],
        }));
    };

    handleInputChange = (event) => {
        this.setState({
            inputMessage: event.target.value,
        });
    };

    handleSendMessage = () => {
        const { inputMessage } = this.state;
        if (inputMessage.trim() !== '') {
            const message = {
                text: inputMessage,
                timestamp: new Date().toLocaleTimeString(),
            };
            this.socket.invoke("SendMessage", "ClientWeb", message.text)
                .then(() => {
                    this.setState({ inputMessage: '' });
                })
                .catch((error) => {
                    console.error('Eroare la apelarea metodei SendMessage:', error);
                });
        }
    };


    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleSendMessage();
        }
    };

    render() {
        const { messages, inputMessage } = this.state;

        return (
            <div className="chat-container" >
                <div className="messages" >
                    {messages.map((message, index) => (
                        <div key={index} className="message">
                            <p className="message-text"><span className="message-date">{message.timestamp}   {message.user}: </span>{message.text}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="input-container">
                        <TextField
                            label="Message"
                            variant="outlined"
                            value={inputMessage}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.handleInputChange}
                            className="input-message"
                            sx={{ input: { color: 'rgb(195, 195, 195)' }, flex: 1 }}
                            InputLabelProps={{ style: { color: 'rgb(195, 195, 195)' } }}
                        />
                        <div className="button-container">
                            <Button variant="contained" onClick={this.handleSendMessage}>Send</Button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}



export { Chat };
export default Chat;

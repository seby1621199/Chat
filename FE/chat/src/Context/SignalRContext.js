import React, { createContext, useContext, useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useRef } from 'react';

const SignalRContext = createContext();

export const useSignalR = () => useContext(SignalRContext);

export const SignalRProvider = ({ children }) => {
    const [connection, setConnection] = useState(null); 
    const [connected, setConnected] = useState(false); 
    const [username, setUsername] = useState(''); 
    const [messages, setMessages] = useState([]); 
    const [usernames,setUsernames]=useState([]);
    const [validationResult, setValidationResult] = useState(null);
    const usernameRef = useRef(username);

    useEffect(() => {
        usernameRef.current = username;
      }, [username]);

    useEffect(() => {
        const connect = async () => {
            const connection = new HubConnectionBuilder()
                .withUrl('https://chat.pavalsebastian.com:5000/chathub')
                .withAutomaticReconnect({
                    nextRetryDelayInMilliseconds: (retryContext) => {
                        return retryContext.elapsedMilliseconds < 60000 ? 2000 : 5000;
                    }
                })
                .build();

            connection.on('ReceiveMessage', (user, message, color) => {
                console.log(`${user}: ${message}`);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { id: Date.now(), user, message, color },
                ]);
            });
            connection.on("ValidateUsernameResponse", (isValid) => {
                console.log(`Validare username: ${isValid}`);
                setValidationResult(isValid);
            });
            connection.on("ReceiveLastMessages", (lastMessages) => {
                const reversedMessages = [...lastMessages].reverse();
                reversedMessages.forEach(message => {
                    const formattedMessages = reversedMessages.map(message => ({
                        id: message._id || message.timestamp, 
                        user: message.username,
                        message: message.message,
                        color: message.color
                    }));

                    setMessages(formattedMessages);
                });
            });
            connection.on("ReceiveAllUsernames",(usernames)=>{
                console.log(usernames);
                setUsernames(usernames);
            });
            connection.onreconnecting(() => {
                console.log('Încercare de reconectare...');
                setConnected(false);
            });
            connection.onreconnected(async () => {
                console.log('Reconectat cu succes');
                console.log('Current username:', usernameRef.current);
                if (usernameRef.current) {
                    await connection.send('SetUsername', usernameRef.current);
                }
                setConnected(true);
            });

            connection.onclose(() => {
                console.log('Deconectat de la SignalR');
                setConnected(false);
            });


            try {
                console.log('try to start');
                await connection.start();
                console.log('Conectat la SignalR');
                setConnection(connection);
                setConnected(true);
            } catch (error) {
                console.error('Eroare la conectarea la SignalR:', error);
            }
        };

        connect();

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, []);

    const updateUsername = async (newUsername) => {
        if (connection && connected) {
            try {
                await connection.send('SetUsername', newUsername);
                console.log('try set username:' + newUsername);
                setUsername(newUsername);
                console.log(`Username setat: ${newUsername}`);
            } catch (error) {
                console.error('Eroare la setarea username-ului:', error);
            }
        } else {
            console.log('Nu sunt conectat la SignalR');
        }
    };
    return (
        <SignalRContext.Provider value={{ connection, connected, username, messages, updateUsername,usernames,validationResult }}>
            {children}
        </SignalRContext.Provider>
    );
};
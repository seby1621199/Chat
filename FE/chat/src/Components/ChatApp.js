import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { useSignalR } from '../Context/SignalRContext';

const ChatApp = () => {
    const { messages, connection, username } = useSignalR();
    const [newMessage, setNewMessage] = useState('');
    const { connected } = useSignalR();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSendMessage = () => {
        if (newMessage.trim() !== '' && connection) {
            connection.send('SendMessageToAll', newMessage);
            setNewMessage('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                height: '90vh',
                backgroundColor: '#1f1f1f',
                overflow: 'hidden',
                padding: isMobile ? '8px' : '16px',
                boxSizing: 'border-box',
                paddingTop: '30px'
            }}
        >
            {/* Messages container */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    width: '75%',
                    backgroundColor: '#2f2f2f',
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: 5,
                    maxHeight: '70%',
                    border: '1px solid #837f7f',
                }}
            >
                <List sx={{ padding: 0 }}>
                    {connected === false && <p style={{ color: '#de4f4f', fontSize: '1.3rem' }}>Not connected.</p>}
                    {messages.map((message) => {
                        const isCurrentUser = message.user === username;
                        const date = new Date(message.id);
                        const hours = date.getHours().toString().padStart(2, '0');
                        const minutes = date.getMinutes().toString().padStart(2, '0');
                        const formattedTime = `${hours}:${minutes}`;

                        return (
                            <ListItem 
                                key={message.id} 
                                sx={{ 
                                    padding: '4px 8px',
                                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        maxWidth: '80%',
                                        alignItems: isCurrentUser ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            backgroundColor: isCurrentUser ? '#0084ff' : '#3e4042',
                                            color: '#fff',
                                            borderRadius: isCurrentUser 
                                                ? '18px 18px 0 18px' 
                                                : '18px 18px 18px 0',
                                            padding: '8px 12px',
                                            marginBottom: '4px',
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                [isCurrentUser ? 'right' : 'left']: '-6px',
                                                width: 0,
                                                height: 0,
                                                border: '7px solid transparent',
                                                borderBottomColor: isCurrentUser ? '#0084ff' : '#3e4042',
                                                borderTop: 0,
                                                borderRight: isCurrentUser ? 0 : 'none',
                                                borderLeft: isCurrentUser ? 'none' : 0,
                                                marginBottom: '-7px',
                                                [isCurrentUser ? 'marginRight' : 'marginLeft']: '-7px'
                                            }
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: isMobile ? '0.8rem' : '0.9rem',
                                                whiteSpace: 'pre-wrap',
                                            }}
                                        >
                                            {message.message}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        sx={{
                                            color: '#c3c3c3',
                                            fontSize: '0.7rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <span style={{ color: message.color || '#64b5f6', fontWeight: 'bold' }}>
                                            {message.user}
                                        </span>
                                        <span>{formattedTime}</span>
                                    </Typography>
                                </Box>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            {/* Message input */}
            <Box
                sx={{
                    display: 'flex',
                    width: '85%',
                    padding: '30px 0',
                    boxSizing: 'border-box',
                }}
            >
                <TextField
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#c3c3c3',
                        },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#c3c3c3',
                        },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px 0 0 8px',
                        },
                        '& .MuiInputBase-input': {
                            color: '#c3c3c3',
                            fontSize: isMobile ? '0.9rem' : '1rem',
                        },
                        '& .MuiInputLabel-root': {
                            color: '#c3c3c3',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#c3c3c3',
                        },
                    }}
                    size={isMobile ? 'small' : 'medium'}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    sx={{
                        borderRadius: '0 8px 8px 0',
                        py: isMobile ? 1 : 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: isMobile ? '0.8rem' : '1rem',
                    }}
                >
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default ChatApp;
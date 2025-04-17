import React, { useState, useEffect } from 'react';
import { useSignalR } from '../Context/SignalRContext';
import { TextField, Button, Box, Typography, useTheme, useMediaQuery } from '@mui/material';

const SetUsername = (props) => {
    const [inputUsername, setInputUsername] = useState('');
    const { username, updateUsername } = useSignalR();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [keyboardActive, setKeyboardActive] = useState(false);
    const { validationResult } = useSignalR();

    useEffect(() => {
        const handleResize = () => {
            setKeyboardActive(window.innerHeight < window.outerHeight * 0.8);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (event) => {
        setInputUsername(event.target.value);
    };

    const handleSubmit = () => {
        if (inputUsername.trim() !== '') {
            updateUsername(inputUsername);
            if (props.onSuccess) {
                props.onSuccess();
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: keyboardActive ? 'flex-start' : 'center',
                minHeight: '100vh',
                height: keyboardActive ? 'auto' : '100vh',
                overflowY: keyboardActive ? 'scroll' : 'hidden',
                backgroundColor: '#1f1f1f',
                p: isMobile ? 2 : 3,
                pt: keyboardActive ? (isMobile ? 4 : 6) : undefined,
                boxSizing: 'border-box',
            }}
        >
            {!keyboardActive && (
                <Box sx={{
                    textAlign: 'center',
                    mb: isMobile ? 2 : 3,
                    width: '100%',
                    maxWidth: '500px'
                }}>
                    <Typography
                        variant={isMobile ? 'h5' : 'h4'}
                        sx={{
                            fontWeight: 'bold',
                            color: '#c3c3c3',
                            fontSize: isMobile ? '1.4rem' : '2rem',
                            lineHeight: 1.2
                        }}
                    >
                        Set Your Username
                    </Typography>
                </Box>
            )}

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#1f1f1f',
                    borderRadius: '8px',
                    p: isMobile ? 2 : 3,
                    boxShadow: 10,
                    width: '75%',
                    maxWidth: '400px',
                    mt: keyboardActive ? (isMobile ? 2 : 4) : 0,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <TextField
                    label="Enter your username"
                    variant="outlined"
                    fullWidth
                    value={inputUsername}
                    onChange={handleChange}
                    sx={{
                        mb: isMobile ? 1.5 : 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#c3c3c3',
                        },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#c3c3c3',
                        },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                        },
                        '& .MuiInputBase-input': {
                            color: '#c3c3c3',
                        },
                        '& .MuiInputLabel-root': {
                            color: '#c3c3c3',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#c3c3c3',
                        },
                    }}
                    size={isMobile ? 'small' : 'medium'}
                    autoFocus={isMobile}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{
                        borderRadius: '8px',
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                    }}
                    size={isMobile ? 'medium' : 'large'}
                >
                    Set Username
                </Button>
            </Box>

            {username && !keyboardActive && (
                <Box sx={{
                    mt: isMobile ? 1.5 : 2,
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '500px'
                }}>

                        {validationResult === false &&
                            <Typography sx={{ color: 'red' }}>Username taken</Typography>}

                </Box>
            )}
        </Box>
    );
};

export default SetUsername;
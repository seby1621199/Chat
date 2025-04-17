import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Modal,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';
import { useSignalR } from '../Context/SignalRContext';
import CircleIcon from '@mui/icons-material/Circle';

const Title = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { usernames } = useSignalR();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '16px',
                backgroundColor: '#1f1f1f'
            }}
        >
            {/* Titlul */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#c3c3c3' }}>
                Chat Room
            </Typography>

            {/* Iconița pentru utilizatori */}
            <IconButton
                onClick={openModal}
                sx={{
                    marginLeft: '8px',
                    borderRadius: '50%',
                    border: '2px #1976d2',
                    color: '#1976d2',
                    '&:hover': {
                        backgroundColor: 'rgba(60, 130, 196, 0.1)',
                    },
                }}
            >
                <PeopleIcon />
            </IconButton>

            {/* Modalul */}
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '400px',
                        maxWidth: '80%',
                        maxHeight: '80vh',
                        backgroundColor: '#2f2f2f',
                        color: '#c3c3c3',
                        boxShadow: 24,
                        p: 3,
                        borderRadius: '8px',
                        overflowY: 'auto',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Connected Users
                    </Typography>
                    <Divider sx={{ marginBottom: '16px' }} />
                    <List>
                        {usernames.map((user, index) => (
                            <ListItem key={index} disablePadding>

                                <ListItemIcon sx={{ minWidth: '32px', color: '#4caf50' }}>
                                    <CircleIcon fontSize="small" />
                                </ListItemIcon>

                                <ListItemText primary={user} sx={{ color: 'lightgreen' }} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Modal>

        </Box>
    );
};

export default Title;
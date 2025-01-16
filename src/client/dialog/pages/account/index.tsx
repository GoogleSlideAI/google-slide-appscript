import React from 'react';
import { Button, Typography, Box, Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

interface AccountProps {
    userEmail: string;
    userName: string;
    onLogout: () => void;
}

const Account: React.FC<AccountProps> = ({ userEmail, userName, onLogout }) => {
    return (
        <Box sx={{ 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            height: '100%' 
        }}>
            <Avatar 
                sx={{ 
                    width: 80, 
                    height: 80,
                    bgcolor: 'primary.main'
                }}
            >
                {userName.charAt(0).toUpperCase()}
            </Avatar>

            <Typography variant="h5" component="h1" gutterBottom>
                {userName}
            </Typography>

            <Typography variant="body1" color="text.secondary" gutterBottom>
                {userEmail}
            </Typography>

            <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={onLogout}
                sx={{ mt: 2 }}
            >
                Log Out
            </Button>
        </Box>
    );
};

export default Account;
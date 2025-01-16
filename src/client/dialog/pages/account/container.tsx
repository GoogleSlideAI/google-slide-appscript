import React from 'react';
import Account from './index';
import { useNavigate } from 'react-router-dom';
// import { server } from '../../../server';

const AccountContainer: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            // await server.logout(); // Your logout API call
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Account
            userEmail="rushpham2002@gmail.com" // Replace with actual user email from your auth system
            userName="Pham Minh Vu" // Replace with actual user name from your auth system
            onLogout={handleLogout}
        />
    );
};

export default AccountContainer; 
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const GoogleOAuthSuccessRedirect: React.FC = () => {
  const { accessToken, refreshToken, from } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (from && accessToken && refreshToken) {
      // Store tokens in localStorage or secure storage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Update auth state in React Query
      queryClient.setQueryData(['auth'], {
        isAuthenticated: true,
        accessToken,
        refreshToken,
      });

      // Navigate back to the original route
      navigate('/' + from, { replace: true });
    }
  }, [accessToken, from, navigate, refreshToken, queryClient]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
};

export default GoogleOAuthSuccessRedirect;
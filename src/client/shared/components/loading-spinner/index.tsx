import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // semi-transparent white
        backdropFilter: 'blur(4px)', // blur effect
        zIndex: 9999, // ensure it's above other content
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress 
          size={48}
          sx={{
            color: '#2563eb', // blue color to match your theme
          }}
        />
        <Box
          sx={{
            color: '#2563eb',
            fontWeight: 500,
            textAlign: 'center',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.6 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.6 }
            }
          }}
        >
          Processing...
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
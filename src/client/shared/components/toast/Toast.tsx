import React, { useEffect } from 'react';
import { Alert, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isOpen: boolean;
  onClose: () => void;
}

const launchFireworks = () => {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 10000 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.2, 0.4), y: 0.1 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.6, 0.8), y: 0.1 }
    });
  }, 250);
};

const Toast: React.FC<ToastProps> = ({ message, type, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      if (type === 'success') {
        launchFireworks();
      }

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, type]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 9999,
            padding: '24px'
          }}
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{
              width: 'auto',
              maxWidth: '90%',
              minWidth: '200px',
              pointerEvents: 'auto'
            }}
          >
            <Alert
              severity={type}
              onClose={onClose}
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: type === 'success' ? 'rgba(237, 247, 237, 0.95)' : 'rgba(253, 237, 237, 0.95)',
                color: type === 'success' ? '#1e4620' : '#5f2120',
                backdropFilter: 'blur(8px)',
                boxShadow: type === 'success' 
                  ? '0 4px 12px rgba(46, 125, 50, 0.1)' 
                  : '0 4px 12px rgba(211, 47, 47, 0.1)',
                borderRadius: '12px',
                padding: '8px 18px',
                whiteSpace: 'pre-wrap',
                width: 'fit-content',
                minHeight: '48px',
                margin: '0 auto',
                '& .MuiAlert-icon': {
                  fontSize: '20px',
                  color: type === 'success' ? '#2e7d32' : '#d32f2f',
                  opacity: 0.8,
                  marginRight: '12px',
                  padding: 0,
                  alignSelf: 'center'
                },
                '& .MuiAlert-message': {
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '24px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                },
                '& .MuiAlert-action': {
                  padding: '0 0 0 0px',
                  marginRight: '-8px',
                  alignSelf: 'center'
                },
                border: type === 'success' 
                  ? '1px solid rgba(46, 125, 50, 0.1)' 
                  : '1px solid rgba(211, 47, 47, 0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: type === 'success' ? 'rgba(237, 247, 237, 0.98)' : 'rgba(253, 237, 237, 0.98)',
                  transform: 'translateY(-1px)',
                  boxShadow: type === 'success' 
                    ? '0 6px 16px rgba(46, 125, 50, 0.15)' 
                    : '0 6px 16px rgba(211, 47, 47, 0.15)',
                }
              }}
            >
              {message}
            </Alert>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default Toast; 
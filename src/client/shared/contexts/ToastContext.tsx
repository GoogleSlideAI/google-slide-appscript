import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/toast/Toast';

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showSuccess: () => {},
  showError: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');

  const showToast = (newMessage: string, newType: 'success' | 'error') => {
    setMessage(newMessage);
    setType(newType);
    setIsOpen(true);
  };

  const showSuccess = (message: string) => showToast(message, 'success');
  const showError = (message: string) => showToast(message, 'error');

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <Toast
        message={message}
        type={type}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext); 
import React from 'react';
import { Check, Download } from 'lucide-react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

interface PresentationStatusProps {
  isLoading: boolean;
  isSuccessful: boolean;
  onDownload?: () => void;
  onViewPresentation?: () => void;
}

// Loading Screen Component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-white">
    <div className="text-center">
      <h2 className="text-[#4F378B] text-xl font-semibold mb-2">
        Please wait few seconds
      </h2>
      <p className="text-[#4F378B] mb-6">
        Jarvis is generating your presentation
      </p>
      
      {/* Progress bar */}
      <div className="relative w-[500px] h-3 bg-gray-100 rounded-full mx-auto overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-[#4F378B] via-[#7B5CC6] to-[#4F378B] rounded-full animate-slide">
          <div className="absolute -inset-y-1 -inset-x-2 bg-[#4F378B] opacity-20 blur-lg rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// Success Screen Component
const SuccessScreen: React.FC<{
  onDownload?: () => void;
  onViewPresentation?: () => void;
}> = ({ onDownload, onViewPresentation }) => (
  <div className="w-full flex items-center justify-center">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg"
    >
      {/* Success Icon with Animation */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1 
        }}
        className="mb-8"
      >
        <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
          <Check className="w-10 h-10 text-green-600" />
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-green-700 mb-3">
          Your presentation is ready!
        </h2>
        <p className="text-gray-600 mb-8">
          We've successfully generated your presentation. 
          You can now download it or view it directly.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button
          variant="contained"
          onClick={onDownload}
          startIcon={<Download className="w-4 h-4" />}
          sx={{
            backgroundColor: '#22c55e', // green-500
            padding: '10px 24px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            boxShadow: '0 4px 6px -1px rgb(34 197 94 / 0.2)',
            '&:hover': {
              backgroundColor: '#16a34a', // green-600
              boxShadow: '0 6px 8px -1px rgb(34 197 94 / 0.3)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Download Presentation
        </Button>
        <Button
          variant="outlined"
          onClick={onViewPresentation}
          sx={{
            borderColor: '#22c55e', // green-500
            color: '#22c55e',
            padding: '10px 24px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#22c55e',
              color: 'white',
              borderColor: '#22c55e',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          View Presentation
        </Button>
      </motion.div>
    </motion.div>
  </div>
);

// Update the animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  .animate-slide {
    animation: slide 3s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

// Main Component
const PresentationStatus: React.FC<PresentationStatusProps> = ({
  isLoading,
  isSuccessful,
  onDownload,
  onViewPresentation
}) => {

  if(isLoading) {
    return <LoadingScreen />;
  }
  if(isSuccessful) {
    return (
      <SuccessScreen 
        onDownload={onDownload}
        onViewPresentation={onViewPresentation}
      />
    );
  }
};

export default PresentationStatus;
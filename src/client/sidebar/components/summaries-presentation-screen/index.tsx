import { Box, Button, Paper } from "@mui/material";

import { useState } from "react";
import { useToast } from "../../../shared/contexts/ToastContext";
import { useServerFunction } from "../../../shared/hooks/useServerFunction";
import LoadingSpinner from "../../../shared/components/loading-spinner";
import { serverFunctions } from "../../../utils/serverFunctions";

const SummariesPresentationScreen = () => {
  const { isLoading, execute } = useServerFunction<any>();
  const { showSuccess, showError } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);

  const summariesPresentation = async () => {
    setIsGenerating(true);
    try {
      const allText = await execute(() => serverFunctions.getAllTextFromPresentation());
      console.log(allText);
      showSuccess('Evaluation completed!');
    } catch (error) {
      console.error("Error details:", error);
      showError('Failed to evaluate slide!');
      setEvaluationResult(null);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="h-full flex flex-col">
      {(isGenerating || isLoading) && <LoadingSpinner />}
      
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: "#FAF8F6",
          padding: 2,
        }}
      >
        <Box sx={{ 
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '70px'
        }}>
          {evaluationResult && (
            <Box sx={{ mb: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: 'white',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  '& b': {
                    display: 'block',
                    fontSize: '1rem',
                  },
                  '& .score': {
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#e2e8f0',
                    color: '#1e293b',
                    fontWeight: 600,
                    marginLeft: '4px'
                  }
                }}
              >
              </Paper>
            </Box>
          )}
        </Box>

        <Box sx={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          backgroundColor: '#FAF8F6',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          zIndex: 10
        }}>
          <Button
            onClick={summariesPresentation}
            variant="contained"
            fullWidth
            disabled={isGenerating || isLoading}
            sx={{ 
              bgcolor: '#2563eb',
              '&:hover': {
                bgcolor: '#1d4ed8',
              },
              '&:disabled': {
                bgcolor: 'rgba(37, 99, 235, 0.5)',
              }
            }}
          >
            {(isGenerating || isLoading) ? "Evaluating..." : "Evaluate Slide"}
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default SummariesPresentationScreen; 
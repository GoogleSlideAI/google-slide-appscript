import { useState } from 'react';
import { Box, Button, Paper, MenuItem, IconButton, Menu } from "@mui/material";
import { useServerFunction } from "../../../shared/hooks/useServerFunction";
import { useToast } from "../../../shared/contexts/ToastContext";
import LoadingSpinner from "../../../shared/components/loading-spinner";
import { serverFunctions } from '../../../utils/serverFunctions';
import Markdown from '../../../shared/components/markdown';
import { BUTTON_TOOL_CONTENT, ButtonToolContent } from './const';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { callAiPresentationSummarize } from '../../../shared/apis/ai-presentation';
import CopyButton from '../../../shared/components/copy-button';

const EvaluateSlideScreen = () => {
  const { isLoading, execute } = useServerFunction<any>();
  const { showSuccess, showError } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);
  const [buttonToolContent, setButtonToolContent] = useState<string>(ButtonToolContent.EVALUATE_SLIDE);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);


  const evaluateData = async () => {
    setIsGenerating(true);
    try {
      const result = await execute(() => serverFunctions.evaluateSlide());
      setEvaluationResult(formatOutput(result));
      showSuccess('Evaluation completed!');
    } catch (error) {
      console.error("Error details:", error);
      showError('Failed to evaluate slide!');
      setEvaluationResult(null);
    } finally {
      setIsGenerating(false);
    }
  }

  const summarizePresentation = async () => {
    setIsGenerating(true);
    try {
      const presentationContent = await execute(() => serverFunctions.getAllTextFromPresentation());

      const summarizedContent = await callAiPresentationSummarize({
        content: presentationContent
      });

      setEvaluationResult(summarizedContent.summary);
      showSuccess('Summarization completed!');
    } catch (error) {
      console.error("Error details:", error);
      showError('Failed to summarize presentation!');
    } finally {
      setIsGenerating(false);
    }
  }

  const formatOutput = (str: string) => {
  return str
    .replace(/#+\s+(.*)/g, '### $1\n')
    .replace(/Score:\s*(\d+)/g, '*Score:* **$1**\n');
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (content: string) => {
    setButtonToolContent(content);
    handleClose();
  };

  const onClick = () => {
    if (buttonToolContent === ButtonToolContent.SUMMARIZE_PRESENTATION) {
      summarizePresentation();
    } else {
      evaluateData();
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
                <Markdown>
                  {evaluationResult}
                </Markdown>
                <CopyButton text={evaluationResult} />
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
          zIndex: 10,
          display: 'flex',
          gap: 2,
          alignItems: 'center'
        }}>
          <>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{
                bgcolor: 'white',
                border: '1px solid rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: 'white',
                  border: '1px solid rgba(0,0,0,0.2)',
                },
              }}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {BUTTON_TOOL_CONTENT.map((content) => (
                <MenuItem 
                  key={content} 
                  onClick={() => handleMenuItemClick(content)}
                  selected={content === buttonToolContent}
                >
                  {content}
                </MenuItem>
              ))}
            </Menu>
          </>

          <Button
            onClick={onClick}
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
            {(isGenerating || isLoading) ? "Processing..." : buttonToolContent}
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default EvaluateSlideScreen;
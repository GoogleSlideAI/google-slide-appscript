import { useState } from 'react';
import { Check2, Copy } from 'react-bootstrap-icons';
import classNames from 'classnames';
import { Tooltip } from '@mui/material';

type CopyButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  text: string;
  copyIconClassName?: string;
  checkIconClassName?: string;
  onCopy?: () => void;
};

const RESET_COPY_STATE_DELAY_DURATION = 1000;

const CopyButton = (props: CopyButtonProps) => {
  const { text, onCopy, className, checkIconClassName, copyIconClassName } = props;
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    try {
      // Create temporary textarea
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // Avoid scrolling to bottom
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      // Execute copy command
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (!successful) {
        throw new Error('Copy command failed');
      }
      
      return true;
    } catch (err) {
      console.error('Failed to copy text:', err);
      return false;
    }
  };

  const handleCopyText = () => {
    console.log('text', text);
    const success = copyToClipboard(text);
    
    if (success) {
      onCopy?.();
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, RESET_COPY_STATE_DELAY_DURATION);
    }
  };
  
  return (
    <Tooltip title={isCopied ? 'Copied' : 'Copy'}>
      <button
        className={classNames('flex h-6 w-6 items-center justify-center rounded-md', className)}
        onClick={handleCopyText}
      >
        {isCopied ? (
          <Check2 size={14} className={classNames('fill-slate-500', checkIconClassName)} />
        ) : (
          <Copy size={14} className={classNames('fill-slate-500', copyIconClassName)} />
        )}
      </button>
    </Tooltip>
  );
};

export default CopyButton;
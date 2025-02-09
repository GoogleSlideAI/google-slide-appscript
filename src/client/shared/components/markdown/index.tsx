import ReactMarkdown, { Components } from 'react-markdown';
import classNames from 'classnames';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import Code from './components/code';
import { Box, Typography } from '@mui/material';
import { remark } from 'remark';
import strip from 'strip-markdown';

type MarkdownProps = {
  children: string;
  className?: string;
  components?: Components;
};

const markdownComponents: Components = {
    code: Code,
    b: ({children}) => (
      <Typography 
        component="div" 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          color: '#1e293b',
          mt: 2,
          mb: 1
        }}
      >
        {children}
      </Typography>
    ),
    i: ({children}) => (
      <Typography 
        component="div" 
        variant="body2" 
        sx={{ 
          color: '#64748b',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {children}
      </Typography>
    ),
    br: () => <Box sx={{ height: '8px' }} />,
    p: ({children}) => (
      <Typography 
        component="p" 
        sx={{ 
          textAlign: 'justify',
          textJustify: 'inter-word',
          mb: 2,
          color: '#334155'  // Optional: adds a nice slate color for better readability
        }}
      >
        {children}
      </Typography>
    ),
  };

const Markdown = (props: MarkdownProps) => {
  const { children, className } = props;

  return (
    <ReactMarkdown
      components={markdownComponents}
      className={classNames('markdown-body', className)}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;

// Add this utility function to transform markdown to plain text
export const markdownToPlainText = async (markdown: string): Promise<string> => {
  const file = await remark()
    .use(strip)
    .process(markdown);
  return String(file);
};

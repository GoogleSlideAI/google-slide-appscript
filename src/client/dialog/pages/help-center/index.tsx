import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Link,
} from '@mui/material';
import {
  ExpandMore,
  Search,
  School,
  Speed,
  Build,
  LiveHelp,
  Email,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SearchWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const HelpSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

interface HelpItem {
  question: string;
  answer: string;
}

const commonQuestions: HelpItem[] = [
  {
    question: 'How do I get started?',
    answer: 'Begin by creating a new project and following our step-by-step tutorial. You can find the "New Project" button in the top navigation bar.',
  },
  {
    question: 'How can I customize my settings?',
    answer: 'Navigate to the Settings panel by clicking the gear icon. There you can modify your preferences, themes, and other configuration options.',
  },
  // Add more FAQ items as needed
];

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = commonQuestions.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Help Center
      </Typography>

      <SearchWrapper>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </SearchWrapper>

      <HelpSection>
        <Typography variant="h6" gutterBottom>
          Quick Start Guide
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <School />
            </ListItemIcon>
            <ListItemText
              primary="Tutorial"
              secondary="Follow our interactive tutorial to learn the basics"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Speed />
            </ListItemIcon>
            <ListItemText
              primary="Getting Started"
              secondary="Quick overview of essential features"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Build />
            </ListItemIcon>
            <ListItemText
              primary="Advanced Features"
              secondary="Explore advanced tools and capabilities"
            />
          </ListItem>
        </List>
      </HelpSection>

      <HelpSection>
        <Typography variant="h6" gutterBottom>
          Frequently Asked Questions
        </Typography>
        {filteredQuestions.map((item, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </HelpSection>

      <HelpSection>
        <Typography variant="h6" gutterBottom>
          Need More Help?
        </Typography>
        <List>
          <ListItem component="a" href="/support">
          <Link
              href="https://www.facebook.com/vu.pham.430865/"
              target="_blank"
              rel="noopener noreferrer"
              className='flex text-inherit no-underline justify-center items-center'
              style={{ display: 'flex', textDecoration: 'none', color: 'inherit' }}
            >
            <ListItemIcon>
              <LiveHelp />
            </ListItemIcon>
            <ListItemText
              primary="Support Center"
              secondary="Browse our knowledge base and documentation"
            />
            </Link>
          </ListItem>
          <ListItem>
            <Link
              href="https://www.facebook.com/vu.pham.430865/"
              target="_blank"
              rel="noopener noreferrer"
              className='flex text-inherit no-underline justify-center items-center'
              style={{ display: 'flex', textDecoration: 'none', color: 'inherit' }}
            >
              <ListItemIcon>
                <Email />
              </ListItemIcon>
              <ListItemText
                primary="Contact Support"
                secondary="Get in touch with our support team"
              />
            </Link>
          </ListItem>
        </List>
      </HelpSection>
    </Box>
  );
};

export default HelpCenter;

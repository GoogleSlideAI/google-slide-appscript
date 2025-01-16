import React from 'react';
import { FormikProps } from 'formik';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
} from '@mui/material';
import { ChevronDown } from 'react-bootstrap-icons';

interface FormValues {
  title: string;
  description: string;
  numberOfSlides: number;
  presentationType: string;
  audience: string;
  toneOfVoice: string;
  slides: any[];
  selectedTheme: string;
}

interface PresentationFormProps {
  formik: FormikProps<FormValues>;
}

const PresentationForm: React.FC<PresentationFormProps> = ({ formik }) => {
  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          What is your presentation about?
          <Typography component="span" variant="caption" color="text.secondary">
            (title)
          </Typography>
        </Typography>
        <TextField
          fullWidth
          id="title"
          name="title"
          placeholder="Tell us here in 5 - 10 words"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          variant="outlined"
          size="small"
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          What else should we know?
          <Typography component="span" variant="caption" color="text.secondary">
            (description)
          </Typography>
        </Typography>
        <TextField
          fullWidth
          id="description"
          name="description"
          multiline
          rows={4}
          placeholder="Use this area for adding instruction for AI
Note: This will only affect the text content"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          variant="outlined"
        />
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Presentation Information
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 2,
        mb: 2 
      }}>
        <FormControl size="small" error={formik.touched.numberOfSlides && Boolean(formik.errors.numberOfSlides)}>
          <InputLabel id="numberOfSlides-label">Number of Slides</InputLabel>
          <Select
            labelId="numberOfSlides-label"
            id="numberOfSlides"
            name="numberOfSlides"
            value={formik.values.numberOfSlides}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            IconComponent={ChevronDown}
            label="Number of Slides"
          >
            <MenuItem value={10}>10 Slides</MenuItem>
            <MenuItem value={15}>15 Slides</MenuItem>
            <MenuItem value={20}>20 Slides</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" error={formik.touched.presentationType && Boolean(formik.errors.presentationType)}>
          <InputLabel id="presentationType-label">Presentation Type</InputLabel>
          <Select
            labelId="presentationType-label"
            id="presentationType"
            name="presentationType"
            value={formik.values.presentationType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            IconComponent={ChevronDown}
            label="Presentation Type"
          >
            <MenuItem value="business">Business</MenuItem>
            <MenuItem value="educational">Educational</MenuItem>
            <MenuItem value="creative">Creative</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" error={formik.touched.audience && Boolean(formik.errors.audience)}>
          <InputLabel id="audience-label">Audience</InputLabel>
          <Select
            labelId="audience-label"
            id="audience"
            name="audience"
            value={formik.values.audience}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            IconComponent={ChevronDown}
            label="Audience"
          >
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="technical">Technical</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" error={formik.touched.toneOfVoice && Boolean(formik.errors.toneOfVoice)}>
          <InputLabel id="toneOfVoice-label">Tone of Voice</InputLabel>
          <Select
            labelId="toneOfVoice-label"
            id="toneOfVoice"
            name="toneOfVoice"
            value={formik.values.toneOfVoice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            IconComponent={ChevronDown}
            label="Tone of Voice"
          >
            <MenuItem value="formal">Formal</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default PresentationForm;
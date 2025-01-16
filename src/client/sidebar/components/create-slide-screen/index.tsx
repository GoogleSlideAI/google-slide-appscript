import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { Formik, Form, FormikProps } from 'formik';
import ThemeSelect from "../theme";
import { serverFunctions } from "../../../utils/serverFunctions";
import { SlideData } from "./types";
import { TEMPLATES, LAYOUTS, INITIAL_VALUES } from "./constants";
import { useServerFunction } from "../../../shared/hooks/useServerFunction";
import { callAiSlideCreate } from "../../../shared/apis/ai-slide";
import LoadingSpinner from "../../../shared/components/loading-spinner";
import { useToast } from "../../../shared/contexts/ToastContext";
import { useState } from "react";


const FormField = ({ 
  label, 
  children 
}: { 
  label: string; 
  children: React.ReactNode;
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="body2"
      sx={{ 
        mb: 0.5, 
        fontWeight: 500, 
        color: "#5F5F5F" 
      }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

const CreateSlideScreen = () => {
  const { isLoading, execute } = useServerFunction<any>();
  const { showSuccess, showError } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (values: SlideData, { setSubmitting }: any) => {
    try {
      setIsProcessing(true);

      // Validate required fields
      if (!values.title || !values.description) {
        showError('Please fill in all required fields');
        return;
      }

      if (!values.presentationId || !values.theme || !values.slideStyle) {
        showError('Please select a theme');
        return;
      }

      // First get slide content from AI
      const slideContent = await callAiSlideCreate({
        title: values.title,
        description: values.description,
        slideId: values.slideStyle
      });

      console.log('AI Slide Content:', slideContent);

      // Call server function with separate parameters
      const result = await execute(() => 
        serverFunctions.createSlide(
          values.presentationId,  // presentationId
          values.theme,          // slideId
          JSON.stringify(slideContent)  // slideContent
        )
      );

      console.log('Server response:', result);
      showSuccess('Successfully!');
    } catch (error) {
      console.error("Error details:", error);
      showError('Failed!');
    } finally {
      setIsProcessing(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {(isProcessing || isLoading) && <LoadingSpinner />}
      
      <Formik
        initialValues={INITIAL_VALUES}
        // validationSchema={slideFormSchema}
        onSubmit={handleSubmit}
      >
        {(formik: FormikProps<SlideData>) => (
          <Paper
            component={Form}
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
              paddingBottom: '70px' // Space for the button
            }}>
              <FormField label="Slide title">
                <TextField
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="title"
                  placeholder="CEO Update"
                  size="small"
                  fullWidth
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  sx={{ bgcolor: "white" }}
                />
              </FormField>

              <FormField label="Description">
                <TextField
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="description"
                  placeholder="This slide summarizes highlights and lowlights from the last quarter."
                  multiline
                  rows={3}
                  size="small"
                  fullWidth
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  sx={{ bgcolor: "white" }}
                />
              </FormField>

              <FormField label="Template">
                <FormControl fullWidth size="small">
                  <Select
                    value={formik.values.template}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="template"
                    sx={{ bgcolor: "white" }}
                  >
                    {TEMPLATES.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormField>

              <FormField label="Layout">
                <FormControl fullWidth size="small">
                  <Select
                    value={formik.values.layout}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="layout"
                    sx={{ bgcolor: "white" }}
                  >
                    {LAYOUTS.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormField>

              <ThemeSelect 
                value={formik.values.theme} 
                template={formik.values.template}
                layout={formik.values.layout}
                onValueChange={(themeData) => {
                  console.log('Theme selected:', themeData);
                  
                  formik.setFieldValue('theme', themeData.id || '');
                  formik.setFieldValue('presentationId', themeData.presentationId || '');
                  formik.setFieldValue('presentationStyle', themeData.presentationStyle || '');
                  formik.setFieldValue('slideStyle', themeData.slideStyle || '');
                  
                  console.log('Updated form values:', formik.values);
                }} 
              />
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
                type="submit"
                variant="contained"
                fullWidth
                disabled={formik.isSubmitting || !formik.isValid || isProcessing || isLoading}
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
                {(isProcessing || isLoading) ? "Creating..." : "Create Slide"}
              </Button>
            </Box>
          </Paper>
        )}
      </Formik>
    </div>
  );
};

export default CreateSlideScreen;

import {
  Box,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Button,
  Paper
} from "@mui/material";
import { Formik, Form, FormikProps } from 'formik';
import { useState } from 'react';
import ThemeSelect from "../theme";
import { useServerFunction } from "../../../shared/hooks/useServerFunction";
import { useToast } from "../../../shared/contexts/ToastContext";
import LoadingSpinner from "../../../shared/components/loading-spinner";
import { serverFunctions } from "../../../utils/serverFunctions";
import { callAiSlideRemix } from "../../../shared/apis/ai-slide";

type SlideData = {
  // language: string;
  template: string;
  layout: string;
  theme: string;
  presentationId: string;
  presentationStyle: string;
  slideStyle: string;
}

const INITIAL_VALUES: SlideData = {
  // language: "English",
  template: "Default Template",
  layout: "All layouts",
  theme: "",
  presentationId: "",
  presentationStyle: "",
  slideStyle: "",
};

// const LANGUAGES = [
//   { value: "English", label: "English" },
//   { value: "Tiếng Việt", label: "Tiếng Việt" },
//   { value: "Español", label: "Español" },
// ];

const TEMPLATES = [
  { value: "Default Template", label: "Default Template" },
  { value: "Professional Template", label: "Professional Template" },
  { value: "Funny Template", label: "Funny Template" },
  { value: "Dark Template", label: "Dark Template" },
];

const LAYOUTS = [
  { value: "All layouts", label: "All layouts" },
  { value: "Single Column", label: "Single Column" },
  { value: "Two Columns", label: "Two Columns" },
];

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

const RemixSlideScreen = () => {
  const { isLoading, execute } = useServerFunction<any>();
  const { showSuccess, showError } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (values: SlideData, { setSubmitting }: any) => {
    try {
      setIsProcessing(true);

      if (!values.presentationId || !values.theme || !values.slideStyle) {
        showError('Please select a theme');
        return;
      }

      const allTextInActiveSlide = await serverFunctions.getAllTextFromActiveSlide();

      const slideContent = await callAiSlideRemix({
        previousContent: allTextInActiveSlide as string,
        slideId: values.slideStyle
      })

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
        // validationSchema={remixFormSchema}
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
            {/* Scrollable content area */}
            <Box sx={{ 
              flex: 1,
              overflowY: 'auto',
              paddingBottom: '70px'
            }}>
              {/* <FormField label="Language">
                <FormControl fullWidth size="small">
                  <Select
                    value={formik.values.language}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="language"
                    sx={{ bgcolor: "white" }}
                  >
                    {LANGUAGES.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormField> */}

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
                  formik.setFieldValue('theme', themeData.id);
                  formik.setFieldValue('presentationId', themeData.presentationId);
                  formik.setFieldValue('presentationStyle', themeData.presentationStyle);
                  formik.setFieldValue('slideStyle', themeData.slideStyle);
                }} 
              />
            </Box>

            {/* Fixed button container */}
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
                {(isProcessing || isLoading) ? "Remixing..." : "Remix Slide"}
              </Button>
            </Box>
          </Paper>
        )}
      </Formik>
    </div>
  );
};

export default RemixSlideScreen;
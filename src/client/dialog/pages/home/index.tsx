import { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
} from '@mui/material';
import PresentationForm from "./components/PresentationForm";
import OutlineContent from "./components/OutlineContent";
import SelectTheme from "./components/SelectTheme";
import PresentationStatus from "./components/PresentationStatus";
import { FormValues } from "./types";
import { useAppStore } from "../../../shared/stores";
import { useServerFunction } from "../../../shared/hooks/useServerFunction";
import { serverFunctions } from "../../../utils/serverFunctions";
import { useToast } from '../../../shared/contexts/ToastContext';

const validationSchema = Yup.object({
  title: Yup.string()
    .min(5, 'At least 5 words')
    .max(2000, 'Max 2000 words')
    .required('Required'),
  description: Yup.string()
    .required('Required'),
  numberOfSlides: Yup.string()
    .required('Required'),
  presentationType: Yup.string()
    .required('Required'),
  audience: Yup.string()
    .required('Required'),
  toneOfVoice: Yup.string()
    .required('Required'),
  slides: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Title is required'),
      subtitle: Yup.string()
    })
  ),
  selectedTheme: Yup.string()
});

const Home = () => {
  const steps = ["Content", "Outline", "Design"];
  const [activeStep, setActiveStep] = useState(0);
  const addHistory = useAppStore((state) => state.addHistory);
  const { isLoading, execute } = useServerFunction<any>();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showSuccess, showError } = useToast();

  const formik = useFormik<FormValues>({
    initialValues: {
      title: '',
      description: '',
      numberOfSlides: 10,
      presentationType: 'business',
      audience: 'general',
      toneOfVoice: 'formal',
      slides: [

      ],
      selectedTheme: '16r2x1rIf8aKPPbN2O3R7eilJQMsoo4BbbxdFgEpa8-k'
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
    },
  });

const generatePresentation = async () => {
  setIsGenerating(true);
  console.log(formik.values.slides);
  try {
    await execute(
      () => serverFunctions.generatePresentation(
        JSON.stringify(formik.values.slides), 
        formik.values.selectedTheme
      ),
      (data) => {
        console.log('Generated presentation:', data);
        setIsSuccess(true);
        showSuccess('Successfully generated!');
      }
    );
  } catch (err) {
    console.error('Error generating presentation:', err);
    showError('Failed to generate!');
  } finally {
    setIsGenerating(false);
  }
}



  const isStepValid = (step: number) => {
    // const touched = formik.touched;
    const errors = formik.errors;
    
    switch (step) {
      case 0:
        return Boolean(
          formik.values.title &&
          formik.values.description &&
          formik.values.numberOfSlides &&
          formik.values.presentationType &&
          formik.values.audience &&
          formik.values.toneOfVoice
        ) && !errors.title && !errors.description;
      case 1:
        return Boolean(formik.values.slides.length > 0 && 
               formik.values.slides.every(slide => slide.name));
      case 2:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {

    if(isStepValid(activeStep)){
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (step: number) => {
    if (step < activeStep && isStepValid(step)) {
      setActiveStep(step);
    }
  };

  const handleGenerate = () => {
    // const slidesJson = JSON.stringify(formik.values.slides);
    generatePresentation();
    formik.handleSubmit();
    addHistory({
      id: crypto.randomUUID(),
      title: formik.values.title,
      createdAt: new Date().toISOString(),
    });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <PresentationForm formik={formik} />;
      case 1:
        return (
          <OutlineContent
            presentationData={{
              title: formik.values.title,
              description: formik.values.description,
              numberOfSlides: formik.values.numberOfSlides,
              presentationType: formik.values.presentationType,
              audience: formik.values.audience,
              toneOfVoice: formik.values.toneOfVoice,
            }}
            slides={formik.values.slides}
            onSlidesChange={(newSlides) => {
              formik.setFieldValue('slides', newSlides);
            }}
          />
        );
      case 2:
        return (
          <SelectTheme
            onSelect={(template) => 
              formik.setFieldValue('selectedTheme', template.id)
            }
          />
        );
      default:
        return null;
    }
  };

  if (isGenerating || isLoading || isSuccess) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <PresentationStatus 
          isSuccessful={isSuccess}
          isLoading={isLoading}
          onDownload={() => console.log('Downloading...')}
          onViewPresentation={() => console.log('Viewing...')}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ mx: "auto", position: "relative" }}>
      <Paper elevation={0} sx={{ p: 4, cursor: "pointer" }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4, mx: 10 }}>
          {steps.map((label, index) => (
            <Step onClick={() => handleStepClick(index)} key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            bottom: 20,
            zIndex: 1000,
          }}
        >
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1, backgroundColor: "white" }}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={!isStepValid(activeStep)}
              >
                Generate Slides
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid(activeStep)}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
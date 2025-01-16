import * as Yup from 'yup';

export const slideFormSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  
  theme: Yup.string()
    .required('Please select a theme')
    .min(1, 'Please select a theme'),

  presentationId: Yup.string()
    .required('Please select a theme')
    .min(1, 'Please select a theme'),

  slideStyle: Yup.string()
    .required('Please select a theme')
    .min(1, 'Please select a theme'),

  // Optional fields used for filtering
  template: Yup.string(),
  layout: Yup.string(),
  presentationStyle: Yup.string(),
});

// For remix form, we only need theme-related validations
export const remixFormSchema = Yup.object().shape({
  theme: Yup.string()
    .required('Please select a theme'),

  presentationId: Yup.string()
    .required('Theme selection is required'),

  presentationStyle: Yup.string()
    .required('Theme selection is required'),

  slideStyle: Yup.string()
    .required('Theme selection is required'),
}); 
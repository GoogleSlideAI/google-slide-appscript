import { SlideData } from "./types";

export const TEMPLATES = [
  { value: "Default Template", label: "Default Template" },
  { value: "Professional Template", label: "Professional Template" },
  { value: "Funny Template", label: "Funny Template" },
  { value: "Dark Template", label: "Dark Template" },
];

export const LAYOUTS = [
  { value: "All layouts", label: "All layouts" },
  { value: "Single Column", label: "Single Column" },
  { value: "Two Columns", label: "Two Columns" },
];

// const LANGUAGES = [
//   { value: "English", label: "English" },
//   { value: "Tiếng Việt", label: "Tiếng Việt" },
//   { value: "Español", label: "Español" },
// ];

export const INITIAL_VALUES: SlideData = {
  // language: "English",
  title: "",
  description: "",
  template: "Default Template",
  layout: "All layouts",
  theme: "",
  presentationId: "",
  presentationStyle: "",
  slideStyle: "",
};

export type FormValues = {
    title: string;
    description: string;
    numberOfSlides: number;
    presentationType: string;
    audience: string;
    toneOfVoice: string;
    slides: Array<{
      id: number;
      name: string;
      subtitle: string;
      position: number;
    }>;
    selectedTheme: string;
  }
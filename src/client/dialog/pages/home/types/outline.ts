export type Slide = {
  id: number;
  name: string;
  subtitle: string;
  position: number;
}

export type PresentationData = {
  title: string;
  description: string;
  numberOfSlides: number;
  presentationType: string;
  audience: string;
  toneOfVoice: string;
}

export type OutlineContentProps = {
  presentationData: PresentationData;
  slides: Slide[];
  onSlidesChange: (slides: Slide[]) => void;
} 
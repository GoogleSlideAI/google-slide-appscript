export type SlideOutline = {
    title: string;
    mediumDescription: string;
  };
  
  export type SlidesResponse = {
    slides: SlideOutline[];
  };

export type AiPresentationOutlinePayload = {
  title:string;
  description:string;
  numberOfSlides:number;
  presentationType:string;
  audience:string;
  toneOfVoice:string;
}

export type AiPresentationContentPayload = {
  outline:string;
}

export type SummarizePresentationPayload = {
  content: string;
};
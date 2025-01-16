export type CreateSlidePayload = {
    title: string;
    description: string;
    slideId: string;
};

export type RemixSlidePayload = {
    previousContent: string;
    slideId: string;
};

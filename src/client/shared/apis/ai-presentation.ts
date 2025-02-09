import axiosInstance from "../lib/axios";
import { AiPresentationOutlinePayload, AiPresentationContentPayload, SummarizePresentationPayload } from "./types/presentation";

export const callAiPresentationOutline = async (payload:AiPresentationOutlinePayload) => {
    const response = await axiosInstance.post('/ai-presentation/outline', payload);
    return response.data;
}

export const callAiPresentationContent = async (payload:AiPresentationContentPayload) => {
    const response = await axiosInstance.post('/ai-presentation/content', payload);
    return response.data;
}

export const callAiPresentationSummarize = async (payload: SummarizePresentationPayload) => {
    const response = await axiosInstance.post('/ai-presentation/summarize', payload);
    return response.data;
}


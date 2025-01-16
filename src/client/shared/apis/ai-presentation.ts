import axiosInstance from "../lib/axios";
import { AiPresentationOutlinePayload, AiPresentationContentPayload } from "./types/presentation";

export const callAiPresentationOutline = async (payload:AiPresentationOutlinePayload) => {
    const response = await axiosInstance.post('/ai-presentation/outline', payload);
    return response.data;
}

export const callAiPresentationContent = async (payload:AiPresentationContentPayload) => {
    const response = await axiosInstance.post('/ai-presentation/content', payload);
    return response.data;
}

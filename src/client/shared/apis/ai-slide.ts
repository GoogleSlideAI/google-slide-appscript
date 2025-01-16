import axiosInstance from "../lib/axios";
import { CreateSlidePayload, RemixSlidePayload } from "./types/slide";

export const callAiSlideCreate = async (payload:CreateSlidePayload) => {
    const response = await axiosInstance.post('/ai-slide/create', payload);
    return response.data;
}

export const callAiSlideRemix = async (payload: RemixSlidePayload) => {
    const response = await axiosInstance.post('/ai-slide/remix', payload);
    return response.data;
}
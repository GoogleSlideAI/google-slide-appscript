import axiosInstance from "../lib/axios";
import { SignInPayload } from "./types/user";

export const signIn = async (payload: SignInPayload) => {
    const response = await axiosInstance.post('/user/sign-in', payload);
    return response.data;
}



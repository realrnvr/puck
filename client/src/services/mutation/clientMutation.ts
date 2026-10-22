import type { AxiosResponse } from "axios";
import type { MessageResponse } from "../../types/api";
import type { MangaData } from "../../types/manga";
import { axiosInstance } from "../api/axios";

export const addFavourite = (
  mangaData: MangaData,
): Promise<AxiosResponse<MessageResponse>> => {
  return axiosInstance.post(`/api/v1/client/add-favourite`, mangaData);
};

export const removeFavourite = (
  mangaId: string,
): Promise<AxiosResponse<MessageResponse>> => {
  return axiosInstance.delete(`/api/v1/client/remove-favourite/${mangaId}`);
};

export const addSubscriber = (data: {
  email: string;
}): Promise<AxiosResponse<MessageResponse>> => {
  return axiosInstance.post("/api/v1/newsletter/add-subscriber", data);
};

export const removeSubscriber = (
  email: string,
): Promise<AxiosResponse<MessageResponse>> => {
  return axiosInstance.delete(`/api/v1/newsletter/remove-subscriber/${email}`);
};

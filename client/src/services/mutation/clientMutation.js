import { axiosInstance } from "../api/axios";

export const addFavourite = (mangaData) => {
  return axiosInstance.post(`/api/v1/client/add-favourite`, mangaData);
};

export const removeFavourite = (mangaId) => {
  return axiosInstance.delete(`/api/v1/client/remove-favourite/${mangaId}`);
};

export const addSubscriber = (data) => {
  return axiosInstance.post("/api/v1/newsletter/add-subscriber", data);
};

export const removeSubscriber = (email) => {
  return axiosInstance.delete(`/api/v1/newsletter/remove-subscriber/${email}`);
};

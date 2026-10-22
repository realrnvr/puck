import axios, { type AxiosInstance } from "axios";

const BASE_URL = "https://uploads.mangadex.org";

export const coverAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "User-Agent": "puck/1.0",
  },
});

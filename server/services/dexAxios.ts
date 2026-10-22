import axios, { type AxiosInstance } from "axios";

const BASE_URL = "https://api.mangadex.org";

export const dexAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "User-Agent": "puck/1.0",
  },
});

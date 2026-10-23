import axios from "axios";
const BASE_URL = "https://uploads.mangadex.org";

export const coverAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "User-Agent": "puck/1.0",
  },
});

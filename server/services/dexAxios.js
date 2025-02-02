import axios from "axios";
import https from "https";
const BASE_URL = "https://api.mangadex.org";

const agent = new https.Agent({
  keepAlive: true,
});

export const dexAxios = axios.create({
  baseURL: BASE_URL,
  httpsAgent: agent,
  headers: {
    "User-Agent": "puck/1.0",
  },
});

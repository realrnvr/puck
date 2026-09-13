import "dotenv/config";
import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,

  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 20) {
        console.log(
          "Too many attempts to reconnect. Redis connection was terminated!",
        );
        return new Error("Too many retries.");
      }

      return retries * 500;
    },
  },
});

redisClient.on("error", (error) => {
  console.error("Redis Client error:", error);
});

import { createClient } from "redis";

export const redisClient = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    reconnectStrategy: function (retries) {
      if (retries > 20) {
        console.log(
          "Too many attempts to reconnect. Redis connection was terminated!"
        );
        return new Error("Too many retries.");
      } else {
        return retries * 500;
      }
    },
  },
});

redisClient.on("error", (error) => {
  console.log("Redis Client error:", error);
});

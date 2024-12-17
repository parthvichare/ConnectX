const Redis = require("ioredis");
require("dotenv").config();

const createRedisClient = () => {
    const client = new Redis({
        host: process.env.REDIS_HOST || 'my-redis', // Correct the typo if it's "REDIS_ENDPOINT"
        // host: "localhost" || "my-redis",
        port: 6379,
        connectTimeout: 10000, // Optional: Time before connection times out
    });

    client.on("connect", () => {
        console.log("Successfully connected to Redis");
    });

    client.on("error", (err) => {
        console.error("Redis connection error:", err);
    });

    return client;
};

module.exports = {createRedisClient};

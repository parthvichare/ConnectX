const Redis = require("ioredis");

const redis = new Redis({
    host: 'redis', // or "my-redis" if using Docker networking
    port: 6379,
});

module.exports = redis;

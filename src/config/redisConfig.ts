import Redis from 'ioredis';

export const RedisClient = new Redis(`rediss://:${process.env.REDIS_CACHE_PASSWORD}@${process.env.REDIS_CACHE_HOST}:${process.env.REDIS_CACHE_PORT}`);
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const options = {
  host: process.env.REDIS_CACHE_HOST,
  port: Number(process.env.REDIS_CACHE_PORT),
  password: process.env.REDIS_CACHE_PASSWORD,
  retryStrategy: (times: number) => Math.min(times * 50, 2000)
};

export const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
});
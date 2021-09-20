import { RedisPubSub } from 'graphql-redis-subscriptions';
import { RedisClient } from './redisConfig';

export const pubsub = new RedisPubSub({
  publisher: RedisClient,
  subscriber: RedisClient,
});
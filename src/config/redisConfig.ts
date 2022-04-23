import Redis from 'ioredis';
import RedisContants from './redisConstants';

export const RedisClient = new Redis({ ...RedisContants });
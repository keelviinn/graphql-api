import { Context } from "graphql-ws";
import { RedisPubSub } from 'graphql-redis-subscriptions';

export { };

declare global {
  interface GraphqlContext extends Context {
    connectionParams: {
      accesstoken: string | null;
    }
  }

  interface ContextReturn {
    auth: string;
    pubsub: RedisPubSub
  }
}
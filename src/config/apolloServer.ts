import cors from 'cors';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { refreshToken } from '../resolvers/auth/auth';
import { pubsub } from './redisClient';
import express from 'express';
import resolvers from '../resolvers';
import typeDefs from '../typeDefs';

export type ContextReturn = {
	auth: string;
  pubsub: RedisPubSub
}

const context = ({ req }: any): ContextReturn => {
	if (!req || !req.headers ) return { auth: '', pubsub };
	const auth: string = req.headers.authorization || '';
	return { auth, pubsub }
}

const corsOptions = {
  // origin: process.env.CROSS_ORIGIN,
  credentials: true 
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default async function startServer() {
  const app = express();
	app.use(cors(corsOptions));
  app.use(express.json({ limit: '5mb' }));  
	app.use('/refresh_token', (req, res) => refreshToken(req, res))

	const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
    context,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      }
    }],
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );
		
  return { app, httpServer, server, subscriptionServer }
}
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import express, { NextFunction, Response } from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import resolvers from '../resolvers';
import typeDefs from '../typeDefs';
import { refreshTokens } from '../middlewares/refreshTokens';

export type ContextReturn = {
	auth: string;
  pubsub: RedisPubSub
}

const context = ({ req, res }: any): any => ({ req, res })

const corsOptions = {
  // origin: process.env.CROSS_ORIGIN,
  credentials: true 
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default async function startServer() {
  const app = express();
	app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json({ limit: '5mb' }));  
  app.use(async (req: any, res: Response, next: NextFunction) => await refreshTokens(req, res, next))
	// app.use('/refresh_token', (req, res) => refreshToken(req, res))

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
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';

import resolvers from '../resolvers';
import typeDefs from '../typeDefs';
import { pubsub } from './redisClient'
import verifyAuth from '../middlewares/verifyAuth';
import UserModel from '../models/user/user.model';

export type ContextReturn = {
	auth: string;
  pubsub: RedisPubSub
}

const context = async ({ req, res }: any) => {
	if (!req || !req.headers ) { return { user: null, pubsub } }
	const operationName = req.body.operationName;
	const accessToken: string = req.headers.accesstoken || '';
	const refreshToken: string = req.headers.refreshtoken || '';
	if (operationName === 'refreshToken' && accessToken) { return { accessToken, refreshToken, pubsub } }
	const user: UserModel | null = await verifyAuth(accessToken);
	return { user, pubsub }
}

const onConnect = async (connectionParams: any, webSocket: any, context: any) => {
	if (!connectionParams && !connectionParams.accesstoken ) { return { user: null, pubsub } };
	const accessToken: string = connectionParams.accesstoken || '';
	const user: UserModel | null = await verifyAuth(accessToken);
	return { user, pubsub }
}

const onDisconnect = async (_: any, context: any) => {
	const initialContext = await context.initPromise;
	const user = initialContext.user;
	return { user, pubsub }
}

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

	const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
    context,
    plugins: [{
      async serverWillStart() {
        return { async drainServer() { subscriptionServer.close(); } };
      }
    }],
  });

  const subscriptionServer = SubscriptionServer.create({ 
    schema, 
    execute, 
    subscribe, 
    onConnect, 
    onDisconnect
  },
    { server: httpServer, path: server.graphqlPath }
  );
		
  return { app, httpServer, server, subscriptionServer }
}
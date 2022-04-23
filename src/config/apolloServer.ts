import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { SubscribeMessage } from 'graphql-ws';
import { ExecutionArgs } from "graphql";
import cookieParser from "cookie-parser";
import cors from 'cors';

import resolvers from '../resolvers';
import typeDefs from '../typeDefs';
import { pubsub } from './pubsubConfig'
import verifyAuth from '../middlewares/verifyAuth';
import UserModel from '../models/user/user.model';

const context = async ({ req, res }: any) => {
  if (!req || !req.headers) { return { user: null, pubsub } }
  const operationName = req.body.operationName;
  const accessToken: string = req.headers.accesstoken || '';
  const refreshToken: string = req.headers.refreshtoken || '';
  if (operationName === 'refreshToken' && accessToken) { return { accessToken, refreshToken, pubsub } }
  const user: UserModel | null = await verifyAuth(accessToken);
  return { user, pubsub }
}

const subContext = async ({ connectionParams }: GraphqlContext, { }: SubscribeMessage, { }: ExecutionArgs) => {
  if (!connectionParams) { return { user: null, pubsub } };
  const accessToken: string = connectionParams.accesstoken || '';
  const user: UserModel | null = await verifyAuth(accessToken);
	return { user, pubsub } 
}

const corsOptions = {
  // origin: process.env.CROSS_ORIGIN,
  credentials: true 
};

export default async function startServer() {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const app = express();
	app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json({ limit: '5mb' }));  
  
  const httpServer = createServer(app);
  
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema, context: subContext }, wsServer);

  const server = new ApolloServer({
    schema,
    context,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
		
  return { app, httpServer, server };
}
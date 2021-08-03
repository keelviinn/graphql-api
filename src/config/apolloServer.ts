import cors from 'cors';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import resolvers from '../resolvers';
import typeDefs from '../typeDefs';
import { refreshToken } from '../resolvers/auth/auth';

const context = async ({ req }: any) => {
	if (!req || !req.headers ) return { };
	const auth = req.headers.authorization || '';
	return { auth }
}

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true 
};

export default async function startServer() {
  const app = express();
	app.use(cors(corsOptions));
  app.use(express.json({ limit: '5mb' }));  
	app.use('/refresh_token', (req, res) => refreshToken(req, res))

	const httpServer = createServer(app);
	const schema = makeExecutableSchema({ typeDefs, resolvers });
  
	const server = new ApolloServer({ schema, introspection: true, context });
	
	const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe }, 
    { server: httpServer, path: "/",  }
  );
		
	return { server, app, httpServer, subscriptionServer };
}
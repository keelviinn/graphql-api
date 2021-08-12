import cors from 'cors';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import resolvers from '../resolvers';
import typeDefs from '../typeDefs';
import { refreshToken } from '../resolvers/auth/auth';

export type ContextReturn = {
	auth: string;
}

const context = ({ req }: any): undefined | ContextReturn => {
	if (!req || !req.headers ) return undefined;
	const auth = req.headers.authorization || '';
	return { auth }
}

var corsOptions = {
  // origin: process.env.CROSS_ORIGIN,
  credentials: true 
};

export default async function startServer() {
  const app = express();
	app.use(cors(corsOptions));
  app.use(express.json({ limit: '5mb' }));  
	app.use('/refresh_token', (req, res) => refreshToken(req, res))

	const httpServer = createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    introspection: true,
    playground: true,
    subscriptions: { path: '/' }
  });
		
  return { app, httpServer, server }
}
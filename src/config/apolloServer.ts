import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import express from 'express';
import resolvers from '../resolvers';
import typeDefs from '../typeDefs';

const context = async ({ req, connection }) => {
	if (!!connection) { return { connection } }
	if (!req || !req.headers ) { return "" }
	const authorization = req.headers.authorization || "";
	return { authorization }
}

export default async function startServer() {
  const app = express();
	const httpServer = createServer(app);
	const schema = makeExecutableSchema({ typeDefs, resolvers });

	const server = new ApolloServer({ schema, introspection: true, context, plugins: [
    ApolloServerPluginLandingPageLocalDefault(),
  ]});
	
	SubscriptionServer.create({ schema, execute, subscribe}, { server: httpServer, path: server.graphqlPath });
		
	return { server, app };
}
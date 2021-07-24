require('dotenv').config();

import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import express from 'express';
import mongoose from 'mongoose';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

const 
	ENVIRONMENT = process.env.NODE_ENV,
	PORT = process.env.PORT || 4000,
	DB: any = process.env.NODE_ENV == 'production' ? process.env.DATABASE_PROD : process.env.DATABASE_DEV;
	
const app = express();
const httpServer = createServer(app);

const context = async ({ req, connection }) => {
	if (!!connection) { return { connection } }
	if (!req || !req.headers ) { return "" }
	const authorization = req.headers.authorization || "";
	return { authorization }
}

async function startServer() {
	const schema = makeExecutableSchema({ typeDefs, resolvers });
	const server = new ApolloServer({ schema, introspection: true, context, plugins: [
    ApolloServerPluginLandingPageLocalDefault(),
  ]});
	await server.start();
	server.applyMiddleware({ app, path: "/" });
	
	SubscriptionServer.create(
		{ schema, execute, subscribe}, 
		{ server: httpServer, path: server.graphqlPath }
	);

	await new Promise((resolve: any) => app.listen({ port: PORT }, resolve));
	console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
	console.log(`🚀 WS Server ready at ws://localhost:${PORT}`);

	mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
		.then(() => console.log(`Connection to database successful on ${ENVIRONMENT} enviroment`))
		.catch((err) => console.error(err));
		
	return { server, app };
}

startServer();

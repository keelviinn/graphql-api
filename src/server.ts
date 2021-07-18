require('dotenv').config();

import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import httpHeadersPlugin from 'apollo-server-plugin-http-headers';
import resolvers from './resolvers';
import typeDefs from './typeDefs';
import Protect from './utils/protect';

const 
	ENVIRONMENT = process.env.NODE_ENV,
	PORT = process.env.PORT || 4000,
	DB: any = process.env.NODE_ENV == 'production' ? process.env.DATABASE_PROD : process.env.DATABASE_DEV;

const context = async ({ req, connection }) => {
	if (!!connection) { return { connection } }
	if (!req?.cookies && !req?.cookies?.accessToken ) { return { setCookies: new Array(), setHeaders: new Array() } }
	const authorization = req.cookies.accessToken || "";
	const user = Protect(authorization);
	const cookies = req?.cookies;
	return { user, cookies, authorization, setCookies: new Array(), setHeaders: new Array() }
}

async function startServer() {
	const server = new ApolloServer({ 
		typeDefs, 
		resolvers, 
		introspection: true, 
		playground: true, 
		plugins: [httpHeadersPlugin],
		context
	});
	await server.start();

	const app = express();
  server.applyMiddleware({ app });

	await new Promise((resolve: any) => app.listen({ port: PORT }, resolve()));
	console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);

	mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
		.then(() => console.log(`Connection to database successful on ${ENVIRONMENT} enviroment`))
		.catch((err) => console.error(err));
		
	return { server, app };
}

startServer();

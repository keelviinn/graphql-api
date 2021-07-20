require('dotenv').config();

import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import resolvers from './resolvers';
import typeDefs from './typeDefs';
import verifyAuth from './middlewares/verifyAuth';

const 
	ENVIRONMENT = process.env.NODE_ENV,
	PORT = process.env.PORT || 4000,
	DB: any = process.env.NODE_ENV == 'production' ? process.env.DATABASE_PROD : process.env.DATABASE_DEV;
	
const app = express();
const context = async ({ req, connection }) => {
	if (!!connection) { return { connection } }
	if (!req || !req.headers ) { return "" }
	const authorization = req.headers.authorization || "";
	return { authorization }
}

async function startServer() {
	const server = new ApolloServer({ typeDefs, resolvers, introspection: true, context	});
	await server.start();
  server.applyMiddleware({ app });

	await new Promise((resolve: any) => app.listen({ port: PORT }, resolve()));
	console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);

	mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
		.then(() => console.log(`Connection to database successful on ${ENVIRONMENT} enviroment`))
		.catch((err) => console.error(err));
		
	return { server, app };
}

startServer();

require('dotenv').config();

import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

const 
	ENVIRONMENT = process.env.ENVIRONMENT,
	PORT = process.env.PORT || 4000,
	DB: any = process.env.NODE_ENV == 'production' ? process.env.DATABASE_PROD : process.env.DATABASE_DEV;

const server = new ApolloServer({ 
	typeDefs, 
	resolvers, 
	introspection: true,
  playground: true, 
});

server.listen({ port: PORT, tracing: true }).then(({ url }) => console.log(`🚀  Server ready at ${url}`));

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then(() => console.log(`Connection to database successful on ${ENVIRONMENT} enviroment`))
	.catch((err) => console.error(err));
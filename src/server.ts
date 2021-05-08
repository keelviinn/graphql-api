require('dotenv').config();

import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

const 
	ENVIRONMENT = process.env.ENVIRONMENT,
	MONGO_DB_URL: string = process.env.MONGO_DB_URL || '',
	PORT = process.env.PORT || 4000

const server = new ApolloServer({ 
	typeDefs, 
	resolvers, 
	introspection: true,
  playground: true, 
});

server.listen({ port: PORT, tracing: true }).then(({ url }) => console.log(`🚀  Server ready at ${url}`));

mongoose.connect(MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => console.log(`Connection to database successful on ${ENVIRONMENT} enviroment`))
	.catch((err) => console.error(err));
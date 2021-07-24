require('dotenv').config();

import startServer from './config/apolloServer';
import startMongoConnection from './config/mongoConnection';

const PORT = process.env.PORT || 4000;

startServer().then(async ({ server, app }) => {
	await server.start();
	server.applyMiddleware({ app, path: "/" });

	await new Promise((resolve: any) => app.listen({ port: PORT }, resolve));
		console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
		console.log(`🚀 WS Server ready at ws://localhost:${PORT}`);

	await startMongoConnection();
});
 


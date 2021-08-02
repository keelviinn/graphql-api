require('dotenv').config();

import startServer from './config/apolloServer';
import startMongoConnection from './config/mongoConnection';

const PORT = process.env.PORT || 8080;

startServer()
	.then(async ({ server, app, httpServer }) => {
		await server.start();
		server.applyMiddleware({ app, path: "/" });

		httpServer.listen(PORT, () => {
		  console.log(`Server is now running on http://localhost:${PORT}`)
		  console.log(`WS is now running on ws://localhost:${PORT}`)
		});

		await startMongoConnection();
	});
 


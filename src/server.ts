require('dotenv').config();

import startServer from './config/apolloServer';
import startMongoConnection from './config/mongoConnection';

const PORT = process.env.PORT || 8080;

(async () => {
	await startServer().then(async ({ app, server, httpServer }) => {
		server.applyMiddleware({ app, path: '/' });
		server.installSubscriptionHandlers(httpServer);

		httpServer.listen(PORT, () => {
			console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
			console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
		});
	});
	
	await startMongoConnection();
})()
 


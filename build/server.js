"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const apollo_server_1 = require("apollo-server");
const mongoose_1 = __importDefault(require("mongoose"));
const resolvers_1 = __importDefault(require("./resolvers"));
const typeDefs_1 = __importDefault(require("./typeDefs"));
const ENVIRONMENT = process.env.ENVIRONMENT, MONGO_DB_URL = process.env.MONGO_DB_URL || '', PORT = process.env.PORT || 4000;
const server = new apollo_server_1.ApolloServer({
    typeDefs: typeDefs_1.default,
    resolvers: resolvers_1.default,
    introspection: true,
    playground: true,
});
server.listen({ port: PORT, tracing: true }).then(({ url }) => console.log(`🚀  Server ready at ${url}`));
mongoose_1.default.connect(MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log(`Connection to database successful on ${ENVIRONMENT} enviroment`))
    .catch((err) => console.error(err));
//# sourceMappingURL=server.js.map
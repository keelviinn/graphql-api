"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const resolvers_1 = __importDefault(require("./resolvers"));
const typeDefs_1 = __importDefault(require("./typeDefs"));
const ENVIRONMENT = process.env.NODE_ENV, PORT = process.env.PORT || 4000, DB = process.env.NODE_ENV == 'production' ? process.env.DATABASE_PROD : process.env.DATABASE_DEV;
const app = express_1.default();
const context = async ({ req, connection }) => {
    if (!!connection) {
        return { connection };
    }
    if (!req || !req.headers) {
        return "";
    }
    const authorization = req.headers.authorization || "";
    return { authorization };
};
async function startServer() {
    const server = new apollo_server_express_1.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default, introspection: true, context });
    await server.start();
    server.applyMiddleware({ app, path: "/" });
    await new Promise((resolve) => app.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    mongoose_1.default.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
        .then(() => console.log(`Connection to database successful on ${ENVIRONMENT} enviroment`))
        .catch((err) => console.error(err));
    return { server, app };
}
startServer();
//# sourceMappingURL=server.js.map
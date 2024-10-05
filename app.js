const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema/typeDefs'); 
const resolvers = require('./schema/resolvers');

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

// Middleware setup
app.use(bodyParser.json());

// Apply Apollo middleware
server.applyMiddleware({ app });

// Export the app instance
module.exports = app;

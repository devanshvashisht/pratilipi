// require('dotenv').config();

// const { ApolloServer } = require('apollo-server-express');
// const express = require('express');
// const morgan = require('morgan');
// const typeDefs = require('./src/schema/typeDefs');
// const resolvers = require('./src/schema/resolvers');
// const authenticate = require('./src/middlewares/auth');
// const db = require('./src/models');


// const app = express();
// const PORT = process.env.PORT;

// app.use(morgan('dev'));
// app.use(express.json());

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }) => authenticate(req),
// });

// const startServer = async () => {
//   await server.start();
//   server.applyMiddleware({ app });

//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
//   });
// };

// startServer();







const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const morgan = require('morgan');
const typeDefs = require('./src/schema/typeDefs');
const resolvers = require('./src/schema/resolvers');
const authenticate = require('./src/middlewares/auth');
const db = require('./src/models');
const { RedisCache } = require('apollo-server-cache-redis');
const Redis = require('ioredis');
const responseCachePlugin = require('apollo-server-plugin-response-cache').default;
require('dotenv').config();


const app = express();
const PORT = process.env.PORT;


app.use(morgan('dev'));
app.use(express.json());

// Create a Redis client
const redis = new Redis({
  host: 'localhost',  // Redis host (or replace with your host)
  port: 6379,         // Redis port
});

// Set up Redis cache
const cache = new RedisCache({
  client: redis,
});

// Set up Apollo Server with Redis caching
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache,  // Use Redis cache
  context: ({ req }) => {
    // Make sure to include cacheControl in the context
    console.log('req',req.cacheControl);
    return {
      cacheControl: req.cacheControl, // Pass cacheControl to context
      // user: authenticate(req), // Any other context properties
    };
  },
  cacheControl: {
    defaultMaxAge: 5,  // Default cache TTL in seconds
  },
  plugins: [
    responseCachePlugin(),
  ],
});

// Start the Apollo Server with Express
server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
});

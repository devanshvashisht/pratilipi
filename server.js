const { ApolloServer,CacheControl } = require('apollo-server-express');
const express = require('express');
const morgan = require('morgan');
const typeDefs = require('./src/schema/typeDefs');
const resolvers = require('./src/schema/resolvers');
const authenticate = require('./src/middlewares/auth');
const db = require('./src/models');
const { RedisCache } = require('apollo-server-cache-redis');
const Redis = require('ioredis');
const responseCachePlugin = require('apollo-server-plugin-response-cache').default;
const {collectDefaultMetrics, Counter, register} = require('prom-client');

const { startProductConsumer } = require('./src/services/productService/consumer');
const { createConnection, setupExchangesAndQueues } = require('./src/common/rabbitmq');
const {startUserConsumer} = require('./src/services/userService/consumer');
const {startDLQHandler} = require('./src/common/dlqhandler');

require('dotenv').config();

let httpServer;


const app = express();
const PORT = process.env.PORT;



app.use(morgan('dev'));
app.use(express.json());


const redis = new Redis({
  host: 'localhost',  
  port: 6379,         
});

function closeRedisConnection() {
  return redis.quit();
}

const cache = new RedisCache({
  client: redis,
});

collectDefaultMetrics();

const productAddedCounter = new Counter({
  name: 'graphql_product_added_total',
  help: 'Total number of products added through GraphQL',
});

const userRegisteredCounter = new Counter({
  name: 'graphql_user_registered_total',
  help: 'Total number of users registered through GraphQL',
});

const orderCreatedCounter = new Counter({
  name: 'graphql_order_created_total',
  help: 'Total number of orders created through GraphQL',
});

// Set up Apollo Server with Redis caching
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache,  // Use Redis cache
  context: ({ req }) => {
    
    
    return {
      user: authenticate(req), // Any other context properties
    };
  },
  cacheControl: {
    defaultMaxAge: 5,  // Default cache TTL in seconds
  },
  plugins: [
    responseCachePlugin(),
    {
      
        requestDidStart() {
          return {
            executionDidStart(requestContext) {
              return {
                willResolveField({ info }) {
                  const operationName = info.fieldName; 
                  
                  
                  if (operationName === '__schema') {
                    return;
                  }
      
                  console.log(`Processing operation: ${operationName}`);
      
                  
                  if (operationName === 'addProduct') {
                    productAddedCounter.inc();
                  } else if (operationName === 'registerUser') {
                    userRegisteredCounter.inc();
                  } else if (operationName === 'createOrder') {
                    orderCreatedCounter.inc();
                  }
                }
              };
            },
          };
        },
      }
      
    
  ],

});


app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
})

startDLQHandler().catch(console.error);



// Start the Apollo Server with Express

  server.start().then(() => {
    server.applyMiddleware({ app });
    const httpServer = app.listen(PORT, (async) => {
      console.log(`Server is running on http://localhost:${PORT}/graphql`);
      console.log(`Prometheus metrics is available at http://localhost:${PORT}/metrics`);


      startProductConsumer(); // Start the RabbitMQ consumer for products
      startUserConsumer();
      console.log('RabbitMQ consumer started.');
    });
  });



// const startServer = async () => {
//   await server.start();
//   server.applyMiddleware({ app });

//   return new Promise((resolve, reject) => {
//     httpServer = app.listen(PORT, async () => {
//       console.log(`Server is running on http://localhost:${PORT}/graphql`);
//       console.log(`Prometheus metrics is available at http://localhost:${PORT}/metrics`);

//       // Start RabbitMQ consumer
//       await startProductConsumer();
      

//       await startUserConsumer();
//       console.log('RabbitMQ consumer started.');

//       // Start Dead Letter Queue handler
//       await startDLQHandler().catch(console.error);

//       // Set up RabbitMQ connection, exchanges, and queues
//       await createConnection().then(setupExchangesAndQueues).catch(console.error);

//       resolve();
//     });

//     httpServer.on('error', reject);
//   });
// };

const stopServer = () => {
  return new Promise((resolve, reject) => {
    if (httpServer) {
      httpServer.close((err) => {
        if (err) return reject(err);
        console.log('Server stopped.');
        resolve();
      });
    } else {
      resolve();
    }
  });
};

createConnection()
  .then(setupExchangesAndQueues())
  .catch(console.error);


//below line for testing
// module.exports = {app,startServer,stopServer,redis,closeRedisConnection} ;
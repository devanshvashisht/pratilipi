# Pratilipi

## Assessment of Pratilipi

### Overview

This project is a microservices-based application that uses RabbitMQ for message queuing, GraphQL for API endpoints, Redis for caching, and Prometheus and Grafana for monitoring. It includes user management, product management, and order processing functionalities.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)



---

## Features

In addition to the core **User**, **Product**, and **Order** services, the project includes several advanced features such as **GraphQL**, **caching**, **monitoring**, **message queue handling**, **failure simulation** and **unit testing**. These features aim to enhance the flexibility, performance, and observability of the system.

---

## GraphQL

### Overview

*GraphQL* is used as the API layer for this project, allowing clients to request exactly the data they need in a single query. This makes data retrieval more efficient compared to REST, which often results in over-fetching or under-fetching of data.

### Benefits of Using GraphQL:
- **Flexible Data Retrieval**: Clients can specify exactly what data they need, making queries efficient and reducing unnecessary data transmission.
- **Single Endpoint**: All operations (queries, mutations, subscriptions) are handled via a single `/graphql` endpoint, simplifying API management.
- **Efficient Development**: Frontend and backend teams can work more independently, as the schema provides clear documentation of available data.
- **Strong Typing**: GraphQL schemas provide strong typing of the data, which enhances validation, debugging, and overall data consistency.

### GraphQL in This Project:
- **Queries**: Used to retrieve data, like fetching user profiles, product listings, or order details.
- **Mutations**: Used for modifying data, like registering users, adding products, or creating orders.
- **Resolvers**: These functions handle the logic of what should happen when a specific GraphQL query or mutation is executed.

### Setting Up GraphQL for This Project:
1. **Install Dependencies**:
   
   The main dependencies for setting up GraphQL include `apollo-server-express` for the server, and any necessary resolvers and typedefs to handle the business logic.
   - **Apollo Server**: Provides the framework for building GraphQL APIs.
   - **Resolvers**: Define the logic for handling GraphQL queries and mutations.
   - **TypeDefs**: Define the schema for the data types and operations allowed in the API.

2. **Type Definitions and Resolvers**:  
   Define your schema in the `typedefs` file, which specifies the types and operations (queries and mutations) that can be performed. Implement the corresponding logic in the resolvers file.

3. **Setup Apollo Server**:  
   - The Apollo Server is configured in `server.js` to handle GraphQL queries and mutations through a single `/graphql` endpoint.
   - It also supports context setup for handling authentication and caching.

### Key Benefits in This Project:

- **Single Query for Multiple Resources**: For example, in one request, you can fetch both the user profile and orders, reducing the number of API calls.
- **Real-Time Updates**: GraphQL subscriptions (optional) could be added to listen to live data updates, like product inventory changes or new orders being placed.

---

## Caching with Redis

### Overview

Caching is implemented using *Redis* to improve the performance of frequently accessed data like product listings. This helps reduce database load and ensures quicker response times for clients.

### How It Works:
- Redis is used as the caching layer for the **Product** microservice.
- Product listings are cached for a defined time (e.g., 5 minutes). If a product listing query is made within this timeframe, the cached data is returned, bypassing the database.

### Key Benefits:
- **Faster Response Times**: The system returns cached responses instead of hitting the database every time a query is made.
- **Reduced Database Load**: By caching commonly requested data, we offload unnecessary queries from the database.

---

## Monitoring with Prometheus and Grafana

### Overview

Monitoring is essential for understanding the health and performance of the system. This project integrates **Prometheus** for collecting metrics and **Grafana** for visualizing those metrics.

### Prometheus:
- Prometheus collects metrics on API performance, memory usage, CPU utilization, and other essential factors.
- It gathers information about operations like product creation, user registration, and order placements.

### Grafana:
- **Grafana** is used to visualize the collected metrics. You can track metrics like the number of products added, orders placed, and user registrations over time.

### Metrics Tracked:
- `graphql_product_added_total`: The total number of products added.
- `graphql_user_registered_total`: The total number of users registered.
- `graphql_order_created_total`: The total number of orders created.

### How to Access:
- The `/metrics` endpoint exposes Prometheus metrics. You can use Prometheus to scrape these metrics and display them in Grafana for real-time monitoring.

### Key Benefits:
- **Real-Time Monitoring**: See how your services perform and track key metrics.
- **System Health**: Identify bottlenecks or performance issues quickly by visualizing metrics in Grafana.

---

## Message Queue with RabbitMQ

### Overview

The project uses **RabbitMQ** to enable asynchronous communication between services. RabbitMQ handles events like product creation and order placements, ensuring reliable message delivery and processing.

### RabbitMQ for Event-Driven Architecture:
- **Product Service** and **Order Service** communicate through message queues. For instance, when an order is placed, an event is emitted, and RabbitMQ ensures the event is delivered to the appropriate consumers (services that handle product inventory updates).

### Dead-Letter Queues (DLQ):
A **Dead-Letter Queue (DLQ)** is used to handle failed message processing. If an event cannot be processed (e.g., a product can't be added or an order fails), the message is sent to a DLQ for later inspection and retry.

### Failure Simulation:
- To test the robustness of the system, simulated failures are implemented. For example, an order or product with a specific ID may fail during processing to test how the system handles errors and routes messages to the DLQ.

### Key Benefits:
- **Asynchronous Processing**: Decouples services, improving scalability and reliability.
- **Failure Handling with DLQ**: Ensures failed messages are captured and can be reprocessed, reducing the risk of data loss.

---

## Authentication and Authorization

### Overview

The project implements a robust **JWT-based authentication** system. JWTs are generated when users log in, and these tokens are used to secure API endpoints.

### Features:
- **JWT Authentication**: Ensures that only authenticated users can access certain features (e.g., placing orders or adding products).
- **Admin Authorization**: Specific operations like adding or deleting products are restricted to users with admin privileges. The `isAdmin` flag is used to control this.

### Key Benefits:
- **Secure Access**: Only authenticated users can perform sensitive operations.
- **Role-Based Access Control**: Admin users have special privileges, ensuring better control over sensitive actions like product management.

---

## Failure Simulation

### Overview

Failure simulation is included in the system to test the robustness and resilience of services. This involves intentionally triggering failures in certain scenarios to see how the system reacts.

### Example:
- For product IDs that are even numbers, the system throws a simulated error. This helps test whether the message is properly routed to the **Dead-Letter Queue (DLQ)** and how the system logs and retries these failed operations.

### Key Benefits:
- **Improved Resilience**: By simulating failures, the system’s ability to recover from unexpected issues is improved.
- **Failure Recovery**: Failed messages are captured in the DLQ for further investigation and reprocessing, ensuring no data is lost.

---

## Error Handling and Logging

### Overview

Error handling is an integral part of the project, ensuring that all failures (whether validation, authentication, or system errors) are captured and logged. This helps maintain the reliability and integrity of the system.

### Key Benefits:
- **Improved Debugging**: Captured errors provide detailed messages that help in troubleshooting and fixing issues.
- **Safe Failure**: The system fails gracefully, ensuring that appropriate responses are returned to the client.



---

## Unit Testing

### Overview

Unit testing is a software testing technique that involves verifying individual components or functions of a program to ensure they work as intended. It helps catch bugs early in development, facilitates code refactoring, and improves overall code quality.

### Key Benefits

- **Early Bug Detection**: Unit tests help identify issues at an early stage, reducing the cost and effort required for debugging later in the development process. 
- **Improved Code Quality**: Writing unit tests encourages better design and code structure, making the codebase easier to maintain and refactor over time.
  
---
## Technologies Used

- Node.js
- Express.js
- Apollo Server (GraphQL)
- RabbitMQ
- Redis
- Sequelize (ORM for PostgreSQL)
- PostgreSQL
- Prometheus
- Grafana
- Jest

---

## Usage


1. **Start RabbitMQ**:
   - Ensure the RabbitMQ server is running by executing the following command:
     ```bash
     rabbitmq-server
     ```

2. **Start Redis**:
   - Start the Redis server with the following command:
     ```bash
     redis-server
     ```

3. **Run the Application**:
   - To start the application, use:
     ```bash
     node server.js
     ```

4. **Access GraphQL Playground**:
   - Once the application is running, visit [http://localhost:3000/graphql](http://localhost:3000/graphql) in your browser to test the GraphQL API.
   
5. **Unit Testing**:
   - To start the testing, use:
     ```bash
     npm test
     ```
---

## API Endpoints

### User Mutations:
- `registerUser(input: RegisterUser)`: Registers a new user.
- `loginUser(input: LoginUser)`: Authenticates a user and returns a token.
- `updateUser(input: UpdateUser)`: Updates user details.
- `deleteUser(userId: Int!)`: Deletes a user.

### Product Mutations:
- `addProduct(input: AddProduct)`: Adds a new product (Admin only).
- `updateProduct(input: UpdateProduct)`: Updates product details (Admin only).
- `deleteProduct(productId: Int!)`: Deletes a product (Admin only).

### Order Mutations:
- `createOrder(input: CreateOrder)`: Creates a new order.
- `deleteOrder(orderId: Int!)`: Deletes an order.

---



## Summary

These extra features greatly enhance the functionality, scalability, and reliability of the project. From **GraphQL** for efficient data fetching, **caching with Redis** to boost performance, **monitoring with Prometheus and Grafana** for real-time insights, and **RabbitMQ** for reliable event-driven processing with DLQ handling, the system is designed to handle high-performance demands, maintain security, and recover gracefully from failures.

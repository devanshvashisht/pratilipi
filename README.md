# Pratilipi
Assessment of Pratilipi

## Overview
This project is a microservices based application that uses RabbitMQ for message queuing, GraphQL for API endpoints, Redis for caching, and Prometheus and Grafana for monitoring. It includes user management, product management, and order processing functionalities.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Simulated Failures](#simulated-failures)
- [Contributing](#contributing)
- [License](#license)


## Features

- User registration and authentication
- Product management (CRUD operations)
- Order management (including inventory updates)
- Message queuing with RabbitMQ
- Caching with Redis
- Monitoring with Prometheus and Grafana
- Error handling with Dead-Letter Queues


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






## API Endpoints

• User Mutations:

- registerUser(input: RegisterUser): Registers a new user.
- loginUser(input: LoginUser): Authenticates a user and returns a token.
- updateUser(input: UpdateUser): Updates user details.
- deleteUser(userId: Int!): Deletes a user.

• Product Mutations:

- addProduct(input: AddProduct): Adds a new product.
- updateProduct(input: UpdateProduct): Updates product details.
- deleteProduct(input: RemoveProduct): Deletes a product.

• Order Mutations:

- createOrder(input: CreateOrder): Creates a new order.
- deleteOrder(orderId: Int!): Deletes an order.

• Queries:

- getUserProfile(userId: Int!): Retrieves user profile.
- getAllUsers: Retrieves all users.
- getProduct(productId: Int!): Retrieves a specific product.
- getAllProducts: Retrieves all products.
- getOrder(orderId: Int!): Retrieves a specific order.
- getAllOrders: Retrieves all orders.
- verifyUser(token: String!): Verifies the user token.


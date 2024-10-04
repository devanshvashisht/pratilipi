# Product Microservice

## Overview

The Product Microservice is responsible for managing the lifecycle of products in the system. This includes operations like adding, updating, retrieving, and deleting products. It ensures that only authorized users (admins) can perform sensitive actions such as adding or deleting products, while general users can query product information.

## GraphQL Type Definitions (TypeDefs)

### Types:
- **Product**: Defines the structure of a product entity in the system. Fields like `productId`, `name`, `description`, `inventory`, and `price` are essential for representing a product. This allows clients to interact with product data, such as querying or updating products.

### Input Types:
- **AddProductInput**: This input type is used when adding a new product. It includes necessary fields like `name`, `description`, `inventory`, `price`, and `userId`. The `userId` ensures that only an admin can add products.
  
- **UpdateProductInput**: This input is used for updating product details, like changing the product’s name, inventory, or price.

### Queries and Mutations:
- **Queries**: Clients can fetch product data. For example, `getProduct` fetches a specific product by its `productId`, while `getAllProducts` retrieves all available products.
  
- **Mutations**: These operations modify product data, such as adding new products, updating existing ones, or deleting products.

## Resolvers

Resolvers are the functions that perform the actual operations defined in the GraphQL schema.

### Query Resolvers:
- **getProduct**: Fetches a product by its ID. This resolver ensures that a valid product is returned if it exists in the system.
  
- **getAllProducts**: Fetches a list of all products. It interacts with the database and includes caching mechanisms for performance optimization.

### Mutation Resolvers:
- **addProduct**: This resolver handles adding a new product. It first verifies if the user performing the operation is an admin. Only admins can add new products. It then ensures that the product does not already exist before creating it.

- **updateProduct**: This mutation allows admins to update the details of a product. The resolver checks for admin privileges, verifies the product's existence, and then updates the necessary fields.

- **deleteProduct**: This mutation deletes a product from the system. It first checks if the user is an admin and then removes the product if it exists.

## Authentication and Authorization

Authentication is essential to ensure that only authorized users can perform specific actions. The `Product Microservice` uses the following mechanisms:

### Admin-Only Access:
- **Admin Privileges**: Operations like adding, updating, and deleting products require the user to have admin privileges. The resolver checks the `isAdmin` flag on the user’s profile before proceeding with these actions.

### JWT-Based Authentication:
- **JWT**: JSON Web Tokens (JWT) are used to authenticate users. The user’s JWT is passed along with the request and is verified before performing admin-only actions.

## Validation

### Input Validation:
Before performing operations like adding or updating a product, input data is validated to ensure it adheres to business rules. For example:
- The product name must be unique.
- The inventory must be a positive integer.
- Price must be a valid floating-point number.

If validation fails, the request is rejected with an appropriate error message.

### Error Handling:
Errors like validation failures or database constraint violations (e.g., duplicate products) are caught and meaningful messages are returned to the client.


## Summary

The Product Microservice ensures secure product management with a focus on admin-only access for critical actions like adding and deleting products. Validation checks and dead-letter queues further ensure the reliability and integrity of the system.




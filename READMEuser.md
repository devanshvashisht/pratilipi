# User Microservice

## Overview

The User Microservice is responsible for all operations related to user management, including registration, authentication, profile updates, and deletion. It also ensures the security of user data through password hashing and JWT-based authentication, while validating input to maintain data integrity.

## GraphQL Type Definitions (TypeDefs)

### Types:
- **User**: The `User` type defines the structure of the user entity in the GraphQL schema. It includes fields such as `id`, `name`, `email`, and `password`. These fields allow clients to interact with user data (e.g., retrieve a user's name and email).
  
- **AuthPayload**: This type encapsulates the response when a user logs in or registers. It includes the `user` data along with a JWT token, which is used for subsequent authentication.

### Input Types:
- **CreateUserInput**: Input types allow clients to send structured data for creating or updating resources. `CreateUserInput` contains fields like `name`, `email`, and `password`, which are required to register a new user.

- **UpdateUserInput**: This input type is used when updating a user's profile. It allows clients to send updated values for fields like `name` and `email`.

### Queries and Mutations:
- **Queries**: These allow clients to retrieve data. For example, the `getUser` query fetches a user by their `id`.
  
- **Mutations**: These enable clients to perform actions like creating, updating, or deleting users. Mutations modify data and can also return updated information or messages indicating success or failure.

## Resolvers

Resolvers are the functions that handle the GraphQL queries and mutations. They map the GraphQL schema to the actual backend logic.

### Query Resolvers:
- **getUser**: This resolver fetches user details by their ID from the database. It ensures that the requested user exists before returning the data.

### Mutation Resolvers:
- **createUser**: This resolver handles user registration. It takes the input data (name, email, password), validates it, and securely stores the password after hashing it. It also generates a JWT token upon successful registration.

- **login**: This resolver handles user login. It verifies that the provided credentials (email and password) are correct. If valid, it generates a JWT token that the user can use for authenticated actions.

- **updateUser**: This resolver updates user details. It ensures that only the fields the client wants to update are modified and then returns the updated user data.

- **deleteUser**: This resolver deletes a user from the system. After ensuring that the user exists, it removes the user data from the database.

## Authentication

Authentication is a critical part of the User Microservice, ensuring only authorized users can access certain resources.

### JWT-Based Authentication:
- **JWT (JSON Web Tokens)** are used to authenticate users. When a user logs in or registers, the system generates a token containing the user’s ID. This token is returned to the client, who then uses it in subsequent requests to verify their identity.
  
- **Token Verification**: Each time a client sends a request requiring authentication, the token is checked. If it’s valid, the user is authorized to perform the action. Otherwise, an error is thrown, preventing unauthorized access.

### Middleware:
Middleware functions check the JWT token included in requests. If the token is missing or invalid, the request is rejected, ensuring security across the application.

## Validation

Data validation ensures that only valid inputs are processed by the system.

- **Input Validation**: Before performing operations like creating or updating a user, the input data (such as email format or password strength) is validated. This prevents invalid data from being stored in the database, ensuring integrity and preventing potential security risks.

- **Error Handling**: If the input data fails validation, appropriate error messages are returned to the client, informing them of the issue (e.g., "Invalid email format").

## Security

### Password Hashing:
- **Hashing**: User passwords are hashed using `bcrypt` before being stored in the database. Hashing ensures that even if the database is compromised, plain-text passwords are not accessible.

### JWT Expiration:
- **Token Expiration**: JWT tokens include an expiration time, limiting how long a token is valid. This provides an additional layer of security by preventing tokens from being used indefinitely.


## Summary

The User Microservice ensures secure and validated user management by combining GraphQL queries and mutations with robust authentication and validation mechanisms. Through the use of JWTs for authentication, hashed passwords for security, and structured error handling with DLQs, the service provides a comprehensive user management solution.


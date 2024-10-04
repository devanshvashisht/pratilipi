# Order Microservice

## Overview

The Order Microservice is responsible for managing orders placed by users. It handles the creation, retrieval, and deletion of orders, while also managing inventory updates for products when an order is placed. The microservice ensures that inventory is accurately tracked and updated to prevent over-ordering.

## GraphQL Type Definitions (TypeDefs)

### Types:
- **Order**: The `Order` type represents an order placed by a user. It includes fields like `orderId`, `productIds`, `userId`, `quantities`, `totalPrice`, and `status`. These fields provide a complete view of an order, including the products in the order, the user who placed it, and the total price.

### Input Types:
- **CreateOrderInput**: This input type is used for placing an order. It includes fields like `productIds`, `userId`, and `quantities` to ensure that the order is placed correctly with valid products and quantities.
  
### Queries and Mutations:
- **Queries**: Clients can retrieve order information. For example, `getOrder` retrieves a specific order by its `orderId`, while `getAllOrders` fetches all orders placed in the system.
  
- **Mutations**: These are used to create or delete orders. When an order is placed, it updates the product inventory to ensure accurate stock tracking.

## Resolvers

### Query Resolvers:
- **getOrder**: This resolver fetches a specific order by its `orderId`, including details like the products in the order and the total price.
  
- **getAllOrders**: Fetches all orders placed in the system. It allows users or admins to track order history.

### Mutation Resolvers:
- **createOrder**: This resolver handles placing an order. It checks the availability of the products in the order and reduces the product inventory accordingly. It also calculates the total price based on the product quantities and prices. If the product quantity exceeds available stock, the order is rejected.

- **deleteOrder**: Deletes an order and rolls back the inventory updates for the associated products. It ensures that if an order is deleted, the corresponding product quantities are returned to the inventory.

## Authentication and Validation

### User Authentication:
The Order Microservice ensures that only authenticated users can place or delete orders. JWT tokens are used to authenticate users before allowing them to place an order.

### Input Validation:
- **Order Validation**: When an order is created, the input (like `productIds` and `quantities`) is validated to ensure it matches the system's constraints (e.g., sufficient inventory for each product).
- **Error Handling**: If the order cannot be processed (e.g., due to insufficient stock), meaningful error messages are returned to the client.

## Inventory Management

### Real-Time Inventory Updates:
When an order is placed, the system reduces the inventory for the ordered products. If the order is deleted or canceled, the inventory is restored.

### Handling Inventory Failures:
In case of inventory mismatches or failures during the order process (e.g., not enough stock), the system routes the failed order to the **Dead-Letter Queue** for further inspection and retry.


## Summary

The Order Microservice ensures accurate order processing by integrating real-time inventory management, user authentication, and input validation. By using DLQs for error handling and JWT-based authentication, the service ensures secure and reliable order management.


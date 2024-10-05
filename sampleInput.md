# GraphQL API Test Queries and Mutations

## Mutations

### 1. Register User
```graphql
mutation RegisterUser {
  registerUser(input: {
    name: "Alice Smith",
    email: "alice.smith@example.com",
    contactNo: "9876543210",
    password: "securePass456",
    language: "English",
    isAdmin: false
  }) {
    message
    user {
      userId
      name
      email
      contactNo
      language
      isAdmin
    }
  }
}
```

### 2. Login User
```graphql
mutation LoginUser {
  loginUser(input: {
    email: "alice.smith@example.com",
    password: "securePass456"
  }) {
    message
    user {
      userId
      name
      email
      contactNo
      language
      isAdmin
    }
    token
  }
}
```

### 3. Update User
```graphql
mutation UpdateUser {
  updateUser(input: {
    userId: 1,
    name: "Alice Johnson",
    contactNo: "0123456789",
    email: "alice.johnson@example.com",
    language: "French"
  }) {
    message
    user {
      userId
      name
      contactNo
      email
      language
    }
  }
}
```

### 4. Delete User
```graphql
mutation DeleteUser {
  deleteUser(userId: 1) {
    message
  }
}
```

### 5. Add Product
```graphql
mutation AddProduct {
  addProduct(input: {
    name: "Gadget Pro",
    description: "Advanced gadget for tech enthusiasts.",
    inventory: 200,
    price: 99.99,
    userId: 1
  }) {
    message
    product {
      productId
      name
      description
      inventory
      price
    }
  }
}
```

### 6. Update Product
```graphql
mutation UpdateProduct {
  updateProduct(input: {
    productId: 1,
    name: "Gadget Pro Plus",
    description: "Updated gadget with more features.",
    inventory: 250,
    quantity: 15,
    userId: 1
  }) {
    message
    product {
      productId
      name
      description
      inventory
    }
  }
}
```

### 7. Delete Product
```graphql
mutation DeleteProduct {
  deleteProduct(input: {
    productId: 1,
    userId: 1
  }) {
    message
  }
}
```

### 8. Create Order
```graphql
mutation CreateOrder {
  createOrder(input: {
    productIds: [1, 3],
    userId: 1,
    quantities: [1, 2]
  }) {
    message
    order {
      orderId
      totalPrice
      userId
      productIds
      quantities
    }
  }
}
```

### 9. Delete Order
```graphql
mutation DeleteOrder {
  deleteOrder(orderId: 1) {
    message
  }
}
```

## Queries

### 1. Get User Profile
```graphql
query GetUserProfile {
  getUserProfile(userId: 1) {
    userId
    name
    email
    contactNo
    language
    isAdmin
  }
}
```

### 2. Get All Users
```graphql
query GetAllUsers {
  getAllUsers {
    userId
    name
    email
    contactNo
    language
    isAdmin
  }
}
```

### 3. Get Product
```graphql
query GetProduct {
  getProduct(productId: 1) {
    productId
    name
    description
    inventory
    price
  }
}
```

### 4. Get All Products
```graphql
query GetAllProducts {
  getAllProducts {
    message
    products {
      productId
      name
      description
      inventory
      price
    }
  }
}
```

### 5. Verify User
```graphql
query VerifyUser {
  verifyUser(token: "sample_jwt_token_here") {
    access
  }
}
```

### 6. Get Order
```graphql
query GetOrder {
  getOrder(orderId: 1) {
    orderId
    totalPrice
    userId
    productIds
    quantities
  }
}
```

### 7. Get All Orders
```graphql
query GetAllOrders {
  getAllOrders {
    orderId
    totalPrice
    userId
    productIds
    quantities
  }
}
```

const { gql } = require('apollo-server-express');

const typeDefs = gql `

    directive @cacheControl(maxAge: Int, scope: CacheControlScope) on FIELD_DEFINITION | OBJECT

    enum CacheControlScope {
        PUBLIC
        PRIVATE
    }

    type User{
        userId: Int!                 
        name: String!                
        email: String!               
        contactNo: String!            
        password: String!            
        language: String!            
        token: String  
        isAdmin: Boolean
    }


    
    input RegisterUser{
        name: String!
        email: String!
        contactNo: String!
        password: String!
        language: String!
        isAdmin: Boolean
    }

    input LoginUser {
        email: String!
        password: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    input UpdateUser{
        userId: Int!
        name: String!
        email: String!
        contactNo: String!
        language: String!
    }

    type DeleteUser{
        message: String!
    }


    type Product{
        productId: Int!                 
        name: String!                
        description: String!               
        inventory: Int!            
        price: Float!            
    }

    

    input AddProduct{
        name: String!                
        description: String!               
        inventory: Int!            
        price: Float!
        userId: Int!
    }

    input UpdateProduct{
        productId: Int!
        name: String!
        description: String!
        inventory: Int!
        price: Float!
        userId: Int!
    }

    input RemoveProduct{
        productId: Int!
        userId: Int!
    }
    type DeleteProduct{
        message: String!
    }
        
    type Order{
        orderId: Int!
        productIds: [Int!]!
        userId: Int!
        quantities: [Int!]!
        totalPrice: Float!
        status: String

    }
    


    input CreateOrder{
        userId: Int!
        productIds: [Int!]!
        quantities: [Int!]!
    }

    type DeleteOrder{
        message: String!
    }


    type VerifyPayload{
        access: Boolean!
    }

    type Pro{
        products: [Product!]
        message: String!
    }
    type Query {
        getUserProfile(userId: Int!): User 
        getAllUsers: [User!]        


        getProduct(productId: Int!): Product
        getAllProducts: Pro @cacheControl(maxAge: 300)


        getOrder(orderId: Int!): Order
        getAllOrders: [Order!]

        verifyUser(token: String!): VerifyPayload
    }


    type Mutation {
        registerUser(input: RegisterUser): User   
        loginUser(input: LoginUser): AuthPayload  
        
        updateUser(input: UpdateUser): User

        addProduct(input: AddProduct): Product
        updateProduct(input: UpdateProduct): Product

        createOrder(input: CreateOrder): Order



        deleteUser(userId: Int!): DeleteUser
        deleteProduct(input: RemoveProduct): DeleteProduct
        deleteOrder(orderId: Int!): DeleteOrder
    }
    
`;

module.exports = typeDefs;
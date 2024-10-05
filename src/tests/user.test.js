const supertest  = require('supertest');
// const app = require('../../server');
const portfinder = require('portfinder');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../schema/typeDefs'); 
const resolvers = require('../schema/resolvers');
const { startServer, stopServer } = require('../../server');
const request = require('supertest');
const { closeConnection } = require('../common/rabbitmq');
const { closeRedisConnection } = require('../../server');

describe('User Microservice', () =>{

    

    beforeAll(async () => {
        await startServer(); // Start the server before running tests
      });
      
      afterAll(async () => {
        await stopServer(); // Stop the server after tests
        await closeConnection();
        await closeRedisConnection();

        await new Promise(resolve => setTimeout(resolve, 1000));
      });


    it('should register a user successfully', async () => {
        const response = await request('http://localhost:3001')
            .post('/graphql')
            .send({
                query: `
                mutation {
                    registerUser(input: {
                        name: "chinmay",
                        email: "chinmay@logic.com",
                        contactNo: "8427676767",
                        password: "mypass",
                        language: "English",
                        isAdmin: false
                    }) {
                        message
                        user {
                            userId
                            email
                        }
                    }
                }
            `
        });

        if (response.body.errors) {
            console.log('Errors:', response.body.errors);
        }


        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.registerUser).not.toBeNull();
        expect(response.body.data.registerUser.message).toBe('User registered successfully!');
    });

    it('should return an error if user already exists', async () => {
        const response = await request('http://localhost:3001')
            .post('/graphql')
            .send({
                query: `
                mutation {
                    registerUser(input: {
                        name: "PPPPPPPP",
                        email: "qwwqee@email.com",
                        contactNo: "8874419900",
                        password: "lappu",
                        language: "English",
                        isAdmin: false
                    }) {
                        message
                        user {
                            userId
                            email
                        }
                    }
                }
            `
            });

        
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors[0].message).toBe('User already exists');
            
        });

        
});

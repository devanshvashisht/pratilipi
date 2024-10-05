const supertest  = require('supertest');
const app = require('../../server');
const portfinder = require('portfinder');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../schema/typeDefs'); 
const resolvers = require('../schema/resolvers');



describe('User Microservice', () =>{

    let server;
    let PORT;

    beforeAll(async () => {
        PORT = await portfinder.getPortPromise();
        console.log(`Server with port ${PORT} is being opened`);
        server = await app.listen(PORT);
    });

    afterAll(async () => {
        console.log(`Server with port ${PORT} is being closed`);
        await server.close();
    });


    it('should register a user successfully', async () => {
        const response = await supertest(app)
            .post('/graphql')
            .send({
                query: `
                mutation {
                    registerUser(input: {
                        name: "Queen",
                        email: "q@ema.com",
                        contactNo: "9090909090",
                        password: "Plpllp",
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
        const response = await supertest(app)
            .post('/graphql')
            .send({
                query: `
                mutation {
                    registerUser(input: {
                        name: "Pre",
                        email: "preas@email.com",
                        contactNo: "998899889",
                        password: "pppppp",
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

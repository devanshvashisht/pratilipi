const supertest = require('supertest');
// const app = require('../../server');
const portfinder = require('portfinder');
const {startServer,stopServer} = require('../../server');
const request  = require('supertest');
const { closeConnection } = require('../common/rabbitmq');
const { closeRedisConnection } = require('../../server');

describe('Product Microservice', () => {

    

    beforeAll(async () => {
        await startServer(); // Start the server before running tests
      });
      
      afterAll(async () => {
        await stopServer(); // Stop the server after tests
        await closeConnection();
        await closeRedisConnection();

        await new Promise(resolve => setTimeout(resolve, 1000));
      });



    it('should add a product successfully', async () => {
        const response = await request('http://localhost:3001')
            .post('/graphql')
            .send({
                query: `
                    mutation {
                        addProduct(input: {
                            name: "Chocochip",
                            description: "Pudding",
                            inventory: 10,
                            price: 300,
                            userId: 1
                        }) {
                            message
                            product {
                                name
                                description
                                inventory
                            }
                        }
                    }
                `
            });


        if (response.body.errors) {
            console.log('Errors:', response.body.errors);
        }
        
        
        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined;


        expect(response.body.data.addProduct.message).toBe('Product added Successfully');
        expect(response.body.data.addProduct.product.name).toBe('Chocochip');
    });

    it('should return an error if product with this name already exists', async () => {
        const response = await request('http://localhost:3001')
            .post('/graphql')
            .send({
                query: `
                    mutation {
                        addProduct(input: {
                            name: "Pringles",
                            description: "Chips",
                            inventory: 50,
                            price: 100,
                            userId: 1
                        }) {
                            message
                            product {
                                name
                                description
                                inventory
                            }
                        }
                    }
                `
            });
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe('Product with this name already exists');
    });
});

const supertest = require('supertest');
// const app  = require('../../server');
const portfinder = require('portfinder');
const { startServer, stopServer } = require('../../server'); 
const  request  = require('supertest');
const { closeConnection } = require('../common/rabbitmq');
const { closeRedisConnection } = require('../../server');

describe('Order Microservice', () => {
    
    

    beforeAll(async () => {
        await startServer(); // Start the server before running tests
      });
      
      afterAll(async () => {
        await stopServer(); // Stop the server after tests
        await closeConnection();
        await closeRedisConnection();

        await new Promise(resolve => setTimeout(resolve, 1000));
      });


    it('should create an order successfully', async () => {
        const response = await request('http://localhost:3001')
            .post('/graphql')
            .send({
                query: `
                    mutation {
                        createOrder(input: {
                            userId: 9,
                            productIds: [6],
                            quantities: [1]
                        }) {
                            message
                            order {
                                orderId
                                totalPrice
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
    
    
            expect(response.body.data.createOrder.message).toBe('Order placed successfully');
    });

    it('should return an error if insufficient inventory', async () => {
        const response = await request('http://localhost:3001')
            .post('/graphql')
            .send({
                query: `
                    mutation {
                        createOrder(input: {
                            userId: 1,
                            productIds: [18],
                            quantities: [1]
                        }) {
                            message
                            order {
                                orderId
                                totalPrice
                            }
                        }
                    }
                `
            });
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toContain('Insufficient inventory');
    });
});

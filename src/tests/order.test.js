const supertest = require('supertest');
const app  = require('../../server');
const portfinder = require('portfinder');


describe('Order Microservice', () => {
    
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


    it('should create an order successfully', async () => {
        const response = await supertest(app)
            .post('/graphql')
            .send({
                query: `
                    mutation {
                        createOrder(input: {
                            userId: 1,
                            productIds: [16, 17],
                            quantities: [1, 1]
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
        const response = await supertest(app)
            .post('/graphql')
            .send({
                query: `
                    mutation {
                        createOrder(input: {
                            userId: 1,
                            productIds: [5],
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

const supertest = require('supertest');
const app = require('../../server');
const portfinder = require('portfinder');


describe('Product Microservice', () => {

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



    it('should add a product successfully', async () => {
        const response = await supertest(app)
            .post('/graphql')
            .send({
                query: `
                    mutation {
                        addProduct(input: {
                            name: "Hot dog",
                            description: "Sausage",
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
        expect(response.body.data.addProduct.product.name).toBe('Hot dog');
    });

    it('should return an error if product with this name already exists', async () => {
        const response = await supertest(app)
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

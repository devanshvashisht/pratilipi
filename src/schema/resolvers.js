const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { where } = require('sequelize');
const Redis = require('ioredis');
const redis = new Redis({
  host: 'localhost', 
  port: 6379, 
});

const { sendProductAddedEvent } = require('../services/productService/producer');


const resolvers = {
    Mutation: {
        async registerUser(_, { input }) {
            const { name, email, contactNo, password, language,isAdmin } = input;
        
            try {
                const existingUser = await db.User.findOne({ where: { email } });
                if (existingUser) {
                    throw new Error('User already exists');
                }
        
                const hashedPassword = await bcrypt.hash(password, 10);
        
                const user = await db.User.create({ name, email, contactNo, password: hashedPassword, language,isAdmin });
        
                return {
                    message: 'User registered successfully!',
                    user
                };


            } catch (error) {
                if (error.name === 'SequelizeValidationError') {
                    throw new Error('Validation error: ' + error.errors.map(err => err.message).join(', '));
                } else if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new Error('Unique constraint error: ' + error.message);
                } else {
                    
                    throw new Error('Registration failed: ' + error.message);
                }
            }
        },
        


        async loginUser(_, {input}){
            const {email, password} = input;

            const user = await db.User.findOne({where: {email} });
            if(!user){
                throw new Error('Invalid credentials');

            }


            const validPassword = await bcrypt.compare(password, user.password);
            if(!validPassword){
                throw new Error('Invalid credentials');
            }

            const token =  jwt.sign({userId: user.userId}, process.env.SECRET_KEY, {expiresIn: '1h'});

            await user.update({token});

            return {message: 'User login successful!',user, token};
        },

        async updateUser(_,{input}){
            const {userId, name, contactNo, email, language} = input;
            try{
                const user = await db.User.findByPk(userId);
                if(!user){
                    throw new Error('User does not exist');
                }

                if(name) user.name = name;
                if(contactNo) user.contactNo = contactNo;
                if(email) user.email = email;
                if(language) user.language = language;

                await user.save();
                return {
                    message: 'User updated succesfully!',
                    user
                };

            }catch(error){
                if (error.name === 'SequelizeValidationError') {
                    throw new Error('Validation error: ' + error.errors.map(err => err.message).join(', '));
                } else if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new Error('Unique constraint error: ' + error.message);
                } else {
                    
                    throw new Error('Internal Server Error: ' + error.message);
                }
            }
            

            
        },
    
        async deleteUser(_,{userId}){
            
            try{
                const user = await db.User.findByPk(userId);
                console.log(user);
                if(!user){
                    throw new Error('User does not exist'); 
                }

                await user.destroy();
                return {message: 'User deleted Successfully'};

            }catch (error) {
                if (error.name === 'SequelizeValidationError') {
                    throw new Error('Validation error: ' + error.errors.map(err => err.message).join(', '));
                } else if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new Error('Unique constraint error: ' + error.message);
                } else {
                    
                    throw new Error('Internal Server Error:' + error.message);
                }
            }
            

        },


        async addProduct(_, {input}) {
            const{name, description , inventory, price,userId}  = input;
            

            try {
                const user = await db.User.findOne({where: {userId}});
                if (!user) {
                    throw new Error('User not found');
                }


                if(!user.isAdmin){
                    throw new Error('Unauthorized');
                }else{
                    const existingProduct = await db.Product.findOne({ where: { name } });
                    if (existingProduct) {
                        throw new Error('Product with this name already exists');
                    }
            
    
                    const product = await db.Product.create({ name, description, inventory, price});

                    await sendProductAddedEvent({
                        productId: product.productId,
                        name: product.name,
                        description: product.description,
                        inventory: product.inventory,
                        price: product.price
                    });
            
                    
                    return {
                        message: 'Product added Successfully',
                        product
                    };
                }

                
            } catch (error) {
                if (error.name === 'SequelizeValidationError') {
                    throw new Error('Validation error: ' + error.errors.map(err => err.message).join(', '));
                } else if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new Error('Unique constraint error: ' + error.message);
                } else {
                    
                    throw new Error('Internal Server Error: ' + error.message);
                }
            }
        },


        async updateProduct(_,{input}){
            const {productId, name, description, inventory, quantity, userId} = input;

            try{
                const user = await db.User.findByPk(userId);

                if(!user.isAdmin){
                    throw new Error('Unauthorized ');
                }else{

                    const product = await db.Product.findOne({where: {productId}});

                    if(name) product.name = name;
                    if(description) product.description = description;
                    if(inventory) product.inventory = inventory;
                    if(quantity) product.quantity = quantity;

                    await product.save();

                    return {message: 'Product updated successfully',product};
                }


            }catch (error) {
                if (error.name === 'SequelizeValidationError') {
                    throw new Error('Validation error: ' + error.errors.map(err => err.message).join(', '));
                } else if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new Error('Unique constraint error: ' + error.message);
                } else {
                    
                    throw new Error('Internal Server Error: ' + error.message);
                }
            }

        },


        async deleteProduct(_,{input}){
            const{productId,userId} = input;
            const user = await db.User.findByPk(userId);
            if(!user.isAdmin){
                throw new Error('Unauthorized');
            }

            try{
                const product = await db.Product.findByPk(productId);
                
                if(!product){
                    throw new Error('Product does not exist'); 
                }

                await product.destroy();
                return {message: 'Product deleted Successfully'};

            }catch (error) {
                if (error.name === 'SequelizeValidationError') {
                    throw new Error('Validation error: ' + error.errors.map(err => err.message).join(', '));
                } else if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new Error('Unique constraint error: ' + error.message);
                } else {
                    
                    throw new Error('Internal Server Error:' + error.message);
                }
            }
            

        },


        async createOrder(_,{input}){
            const{productIds, userId, quantities} = input;

            try{
                
    
                if (productIds.length !== quantities.length) {
                    throw new Error('Mismatch between product IDs and quantities');
                }


                let totalPrice = 0;
                for (let i=0; i<productIds.length; i++) {
                    const productId = productIds[i];
                    const quantity = quantities[i];


                    const product = await db.Product.findByPk(productId);
                    if (!product) {
                        throw new Error(`Product with ID ${productId} not found`);
                    }
                    totalPrice += product.price * quantity;


                    if (quantity > product.inventory) {
                        throw new Error(`Insufficient inventory for product ID ${productId}`);
                    }


                    await product.update({ inventory: product.inventory - quantity });
                }

                const order = await db.Order.create({
                    productIds,
                    userId,
                    quantities,
                    totalPrice,
                    
                });

                return {message: 'Order placed successfully',order};



            }catch(error){
                if (error.name === 'SequelizeValidationError') {
                    throw new Error('Validation error: ' + error.errors.map(err => err.message).join(', '));
                } else if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new Error('Unique constraint error: ' + error.message);
                } else {
                    throw new Error('Internal Server Error: ' + error.message);
                }
            }
        },


        async deleteOrder(_,{orderId}){
            
            
            try{
                const order = await db.Order.findByPk(orderId);
                const {productIds , quantities} = order;

                if(!order){
                    throw new Error('Order does not exist'); 
                }


                for (let i = 0; i < productIds.length; i++) {
                    const productId = productIds[i];
                    const quantity = quantities[i];
              
                    
                    const product = await db.Product.findByPk(productId);
                    if (!product) {
                      throw new Error(`Product with ID ${productId} not found`);
                    }
              
                    
                    product.inventory += quantity;
                    await product.save(); 
                }



                await order.destroy();
                return {message: 'Order deleted Successfully and Inventory updated successfully'};

            }catch (error) {
                if (error.name === 'SequelizeValidationError') {
                    throw new Error('Validation error: ' + error.errors.map(err => err.message).join(', '));
                } else if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new Error('Unique constraint error: ' + error.message);
                } else {
                    
                    throw new Error('Internal Server Error:' + error.message);
                }
            }
            

        },


    },

    Query: {
        async getUserProfile(_, {userId}){
            const user = await db.User.findByPk(userId);
            if(!user){
                throw new Error('User not found');
            }
            return user;
            
        },

        async getAllUsers() {
            const users = await db.User.findAll(); 
            return users; 
        },


        async getProduct(_, {productId}){
            const product = await db.Product.findByPk(productId);
            if(!product){
                throw new Error('Product not found');
            }
            return product;
        },

        async getAllProducts(_, __) {
        

            const cacheKey = 'allProducts'; 

            // Check if the data is already in the Redis cache
            const cachedProducts = await redis.get(cacheKey);
            if (cachedProducts) {
                // If data is found in cache, return it
                console.log('Returning cached data');
                return {
                    message: 'Products retrieved from cache',
                    products: JSON.parse(cachedProducts),
                }; // Parse the cached JSON string back into an object
            }
           
            // If data is not in cache, fetch it from the database
            const products = await db.Product.findAll(); 

            // Store the fetched data in Redis cache for 300 seconds
            await redis.set(cacheKey, JSON.stringify(products), 'EX', 300); // Set expiry for 5 minutes

            return {
                message: 'Products retrieved from database',
                products,
            };
        },

        async verifyUser(_, { token }) {
            if (!token) {
                throw new Error('Token not found');
            }
        
            let access = false;
        
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                const userId = decoded.userId;
        
                const user = await db.User.findByPk(userId);
        
                if (!user) {
                    throw new Error('User not found');
                }
        
                access = true;
            } catch (error) {
                throw new Error('Invalid or expired token');
            }
        
            return { access };
        },


        async getOrder(_, { orderId }) {
            const order = await db.Order.findByPk(orderId);
            if (!order) {
              throw new Error('Order not found');
            }
            return order;
        },

        async getAllOrders() {
            return await db.Order.findAll();
        },
      
    },
};

module.exports = resolvers;
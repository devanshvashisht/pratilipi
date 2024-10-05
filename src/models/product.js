const {DataTypes} = require("sequelize");


//defining sequelize model for products
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product',{
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,  
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false, 
        },
        inventory: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false, 
        },


    });


    
    
    return Product;
};

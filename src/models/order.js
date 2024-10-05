const {DataTypes} = require("sequelize");

//defining sequelize model for orders
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        totalPrice: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Pending',
        },
        quantities: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,  
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Users', 
              key: 'userId',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        productIds: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
        
          },   

    });

    Order.associate = function(models) {
        Order.belongsTo(models.User, { foreignKey: 'userId' });
        
    };  

    return Order;
};
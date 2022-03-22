const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = (sequelize, User, Drink) => {

    class UserDrinks extends Model { }

    UserDrinks.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            field: 'user_id',
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            },
            allowNull: false,
            unique: false
        },
        drinkId: {
            field: 'drink_id',
            type: DataTypes.INTEGER,
            references: {
                model: Drink,
                key: 'id'
            },
            allowNull: false,
            unique: false
        },
        creatorId: {
            field: 'creator_id',
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            },
            allowNull: false,
            unique: false
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
            allowNull: false
        }

    }, {
        sequelize,
        modelName: 'user_drink',
        initialAutoIncrement: 1
    })

    return UserDrinks;
}
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, User, Drink) => {

    class UserDrinks extends Model { }

    UserDrinks.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        creatorId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            },
            allowNull: false
        },
        drinkId: {
            type: DataTypes.INTEGER,
            references: {
                model: Drink,
                key: 'id'
            }
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'user_drink'
    })

    return UserDrinks;
}
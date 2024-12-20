const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DrinkCategory) => {

    class Drink extends Model { }

    Drink.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        categoryId: {
            type: DataTypes.INTEGER,
            field: 'category_id'
        }
    }, {
        sequelize,
        modelName: 'drink'
    })
    
    return Drink;
}
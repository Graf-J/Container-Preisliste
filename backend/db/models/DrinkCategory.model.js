const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {

    class DrinkCategory extends Model { }

    DrinkCategory.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'drinkCategory'
    })
    
    return DrinkCategory;
}
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {

    class Category extends Model { }

    Category.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'category'
    })
    
    return Category;
}
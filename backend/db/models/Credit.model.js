const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, User) => {

    class Credit extends Model { }

    Credit.init({
        money: {
            type: DataTypes.DOUBLE,
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
        modelName: 'credit'
    })
    
    return Credit;
}
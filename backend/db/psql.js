const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_URI, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },

    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

let db = { }

db.sequelize = sequelize;
db.User = require('./models/User.model')(sequelize);
db.DrinkCategory = require('./models/DrinkCategory.model')(sequelize)
db.Drink = require('./models/Drink.model')(sequelize, db.DrinkCategory);
db.UserDrinks = require('./models/UserDrinks.model')(sequelize, db.User, db.Drink);

// Associations
// db.User.belongsToMany(db.Drink, { through: { model: db.UserDrinks, unique: false }, foreignKey: 'userId', onDelete: 'CASCADE' });
// db.Drink.belongsToMany(db.User, { through: { model: db.UserDrinks, unique: false }, foreignKey: 'drinkId', onDelete: 'SET NULL' });
db.User.belongsToMany(db.Drink, { through: { model: db.UserDrinks, unique: false }, constraints: false, onDelete: 'CASCADE' }, { as: 'user', foreignKey: 'userId' });
db.User.belongsToMany(db.Drink, { through: { model: db.UserDrinks, unique: false }, constraints: false, onDelete: 'CASCADE' }, { as: 'creator', foreignKey: 'creatorId' });
db.Drink.belongsToMany(db.User, { through: { model: db.UserDrinks, unique: false }, constraints: false, onDelete: 'SET NULL' });
db.User.hasMany(db.UserDrinks);
db.UserDrinks.belongsTo(db.User);
db.Drink.hasMany(db.UserDrinks);
db.UserDrinks.belongsTo(db.Drink);

db.Drink.belongsTo(db.DrinkCategory, { onDelete: 'SET NULL', onUpdate: 'CASCADE'});

module.exports = db;
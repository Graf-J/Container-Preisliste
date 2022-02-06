const db = require('../db/psql');

module.exports.get = async (req, res) => {
    try {
        const drinkCategories = await db.DrinkCategory.findAll({ attributes: ['id', 'name'], order: [['createdAt', 'DESC']] });
        res.status(200).json(drinkCategories);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.add = async (req, res) => {
    try {
        const duplicate = await db.Drink.findOne({ where: { name: req.body.name }})
        if (duplicate) {
            throw new Error(`DrinkCategory ${ duplicate.name } already exists!`);
        }

        const drinkCategory = await db.DrinkCategory.create({
            name: req.body.name
        })

        res.status(200).json(drinkCategory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.update = async (req, res) => {
    try {
        const drinkCategory = await db.DrinkCategory.findOne({ where: { id: req.params.id }})
        
        if (!drinkCategory) {
            throw new Error('DrinkCategory not found');
        }

        drinkCategory.name = req.body.name;

        await drinkCategory.save();

        res.status(200).json({
            id: drinkCategory.id,
            name: drinkCategory.name
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.delete = async (req, res) => {
    try {
        const drinkCategory = await db.DrinkCategory.findOne({ where: { id: req.params.id }})
        
        if (!drinkCategory) {
            throw new Error('User not found');
        }

        await drinkCategory.destroy();

        res.status(200).send('Ok');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
const db = require('../db/psql');

module.exports.get = async (req, res) => {
    try {
        const drinks = await db.Drink.findAll({ 
            attributes: ['id', 'name', 'price'],
            order: [['createdAt', 'DESC']],
            include: [{
                model: db.DrinkCategory,
                attributes: ['id', 'name']
            }]
        });

        res.status(200).json(drinks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.add = async (req, res) => {
    try {
        const duplicate = await db.Drink.findOne({ where: { name: req.body.name }})
        if (duplicate) {
            throw new Error(`Drink ${ duplicate.name } already exists!`);
        }

        const drink = await db.Drink.create({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            drinkCategoryId: req.body.drinkCategoryId
        })

        res.status(200).json(drink);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.update = async (req, res) => {
    try {
        let drink = await db.Drink.findOne({ 
            attributes: ['id', 'name', 'price'],
            where: { id: req.params.id }, 
            include: { 
                model: db.DrinkCategory,
                attributes: ['id', 'name']
            }
        });
        
        if (!drink) {
            throw new Error('DrinkCategory not found');
        }

        let drinkCategoryChanged = false;
        if (drink.drinkCategoryId !== req.body.drinkCategoryId) { drinkCategoryChanged = true }

        drink.name = req.body.name;
        drink.price = req.body.price;
        drink.drinkCategoryId = req.body.drinkCategoryId;

        await drink.save();

        if (drinkCategoryChanged) {
            drink = await db.Drink.findOne({ 
                attributes: ['id', 'name', 'price'],
                where: { id: req.params.id }, 
                include: { 
                    model: db.DrinkCategory,  
                    attributes: ['id', 'name']
                }
            });
        }

        res.status(200).json(drink);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.delete = async (req, res) => {
    try {
        const drink = await db.Drink.findOne({ where: { id: req.params.id }})
        
        if (!drink) {
            throw new Error('User not found');
        }

        await drink.destroy();

        res.status(200).send('Ok');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
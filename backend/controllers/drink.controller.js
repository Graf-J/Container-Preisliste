const { QueryTypes } = require('sequelize');
const db = require('../db/psql');

module.exports.get = async (req, res) => {
    try {
        const drinks = await db.Drink.findAll({ 
            attributes: ['id', 'name', 'price'],
            order: [['createdAt', 'DESC']],
            include: [{
                model: db.Category,
                attributes: ['id', 'name']
            }]
        });

        res.status(200).json(drinks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.getPopularDrinks = async (req, res) => {
    try {
        const drinks = await db.sequelize.query(`SELECT d.id, d.name, d.price, COALESCE(SUM(ud.amount), 0) AS total, (array_agg(c.name ORDER BY d.id DESC))[1] as category FROM drinks AS d LEFT JOIN user_drinks AS ud ON ud.drink_id = d.id LEFT JOIN categories AS c ON d.category_id = c.id GROUP BY d.id ORDER BY total DESC;`, { type: QueryTypes.SELECT });

        res.status(200).json(drinks);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
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
            categoryId: req.body.categoryId
        })

        const drinkWithCategory = await db.Drink.findOne({
            where: { id: drink.id },
            attributes: ['id', 'name', 'price'],
            include: [{
                model: db.Category,
                attributes: ['id', 'name']
            }]
        })

        res.status(200).json(drinkWithCategory);
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
                model: db.Category,
                attributes: ['id', 'name']
            }
        });
        
        if (!drink) {
            throw new Error('Drink not found');
        }

        let categoryChanged = false;
        if (drink.categoryId !== req.body.categoryId) { categoryChanged = true }

        drink.name = req.body.name;
        drink.price = req.body.price;
        drink.categoryId = req.body.categoryId;

        await drink.save();

        if (categoryChanged) {
            drink = await db.Drink.findOne({ 
                attributes: ['id', 'name', 'price'],
                where: { id: req.params.id }, 
                include: { 
                    model: db.Category,  
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
            throw new Error('Drink not found');
        }

        await drink.destroy();

        res.status(200).send('Ok');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
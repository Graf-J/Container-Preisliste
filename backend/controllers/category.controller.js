const db = require('../db/psql');

module.exports.get = async (req, res) => {
    try {
        const categories = await db.Category.findAll({ attributes: ['id', 'name'], order: [['createdAt', 'DESC']] });
        res.status(200).json(categories);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.add = async (req, res) => {
    try {
        const duplicate = await db.Category.findOne({ where: { name: req.body.name }})
        if (duplicate) {
            throw new Error(`Category ${ duplicate.name } already exists!`);
        }

        const Category = await db.Category.create({
            name: req.body.name
        })

        res.status(200).json(Category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.update = async (req, res) => {
    try {
        const category = await db.Category.findOne({ where: { id: req.params.id }})
        
        if (!category) {
            throw new Error('Category not found');
        }

        category.name = req.body.name;

        await category.save();

        res.status(200).json({
            id: category.id,
            name: category.name
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.delete = async (req, res) => {
    try {
        const category = await db.Category.findOne({ where: { id: req.params.id }})
        
        if (!category) {
            throw new Error('User not found');
        }

        await category.destroy();

        res.status(200).send('Ok');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
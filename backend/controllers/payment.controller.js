const { QueryTypes } = require('sequelize')
const db = require('../db/psql');

module.exports.get = async (req, res) => {
    try {
        const stepsize = parseInt(req.query.stepsize);
        const page = parseInt(req.query.page);
        
        if (isNaN(stepsize)) throw new Error('Type Error');
        if (isNaN(page)) throw new Error('Type Error');

        const offset = (stepsize * page) - stepsize;

        const result = await db.sequelize.query(`SELECT ud.id, ud.amount, ud.created_at, u.name as user, c.name as creator, d.name as drink, d.price as price, ud.amount * d.price as sumprice FROM user_drinks AS ud INNER JOIN users as u ON ud.user_id = u.id INNER JOIN users as c ON ud.creator_id = c.id INNER JOIN drinks as d ON ud.drink_id = d.id WHERE ud.user_id = ${ req.userId } ORDER BY ud.created_at DESC LIMIT ${ stepsize } OFFSET ${ offset };`, { type: QueryTypes.SELECT });

        res.status(200).json(result);
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.getEntries = async (req, res) => {
    try {
        const result = await db.sequelize.query(`SELECT COUNT(*) FROM user_drinks WHERE user_id = ${ req.userId };`, { type: QueryTypes.SELECT });
        numEntries = parseInt(result[0].count);

        if (isNaN(numEntries)) throw new Error('Type Error');

        res.status(200).json({ count: numEntries });
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.add = async (req, res) => {
    try {
        if (!req.body.userId || !req.body.drinkId) {
            throw new Error('Request not complete');
        }

        const payment = await db.UserDrinks.create({
            creatorId: req.userId,
            amount: req.body.amount,
            userId: req.body.userId,
            drinkId: req.body.drinkId
        })

        res.status(200).json(payment);
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.delete = async (req, res) => {
    try {
        const payment = await db.UserDrinks.findOne({ where: { id: req.params.id }})
        
        if (!payment) {
            throw new Error('Payment not found');
        }

        await payment.destroy();

        res.status(200).send('Ok');
    } catch (err) {
        res.sendStatus(400);
    }
}
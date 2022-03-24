const { QueryTypes } = require('sequelize');
const db = require('../db/psql');

module.exports.getOwnCredits = async (req, res) => {
    try {
        const stepsize = parseInt(req.query.stepsize);
        const page = parseInt(req.query.page);
        
        if (isNaN(stepsize)) throw new Error('Type Error');
        if (isNaN(page)) throw new Error('Type Error');
        
        const offset = (stepsize * page) - stepsize;

        const credits = await db.sequelize.query(`SELECT c.id, c.money, c.created_at, u.name FROM credits as c INNER JOIN users as u ON c.creator_id = u.id WHERE c.user_id = ${ req.userId } ORDER BY created_at DESC LIMIT ${ stepsize } OFFSET ${ offset };`, { type: QueryTypes.SELECT });

        res.status(200).json(credits);
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.getUserCredits = async (req, res) => {
    try {
        const userId = req.params.id;
        const stepsize = parseInt(req.query.stepsize);
        const page = parseInt(req.query.page);
        
        if (isNaN(userId)) throw new Error('Type Error');
        if (isNaN(stepsize)) throw new Error('Type Error');
        if (isNaN(page)) throw new Error('Type Error');
        
        const offset = (stepsize * page) - stepsize;

        const credits = await db.sequelize.query(`SELECT c.id, c.money, c.created_at, u.name FROM credits as c INNER JOIN users as u ON c.creator_id = u.id WHERE c.user_id = ${ userId } ORDER BY created_at DESC LIMIT ${ stepsize } OFFSET ${ offset };`, { type: QueryTypes.SELECT });

        res.status(200).json(credits);
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.getEntries = async (req, res) => {
    try {
        const result = await db.sequelize.query(`SELECT COUNT(*) FROM credits WHERE user_id = ${ req.userId };`, { type: QueryTypes.SELECT });
        numEntries = parseInt(result[0].count);

        if (isNaN(numEntries)) throw new Error('Type Error');

        res.status(200).json({ count: numEntries });
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.getEntriesAsAdmin = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new Error('Type Error');


        const result = await db.sequelize.query(`SELECT COUNT(*) FROM credits WHERE user_id = ${ id };`, { type: QueryTypes.SELECT });
        numEntries = parseInt(result[0].count);

        if (isNaN(numEntries)) throw new Error('Type Error');

        res.status(200).json({ count: numEntries });
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.add = async (req, res) => {
    try {
        const updatedMoney = await db.sequelize.transaction(async t => {
            await db.Credit.create({
                money: req.body.money,
                creatorId: req.userId,
                userId: req.body.userId
            }, { transaction: t });

            const user = await db.User.findOne({ where: { id: req.body.userId }}, { transaction: t });
            if (!user) throw new Error('User not found');

            const updatedUser = await user.increment('money', { by: req.body.money }, { transaction: t });

            return updatedUser.money
        })

        res.status(200).json({ money: updatedMoney });
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.delete = async (req, res) => {
    try {
        const updatedMoney = await db.sequelize.transaction(async t => {
            const credit = await db.Credit.findOne({ where: { id: req.params.id }}, { transaction: t });
            if (!credit) throw new Error('Credit not found');

            const user = await db.User.findOne({ where: { id: credit.userId }}, { transaction: t });
            if (!user) throw new Error('User not found');

            const updatedUser = await user.decrement('money', { by: credit.money }, { transaction: t });

            await credit.destroy({ transaction: t });

            return updatedUser.money;
        })

        res.status(200).json({ money: updatedMoney });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
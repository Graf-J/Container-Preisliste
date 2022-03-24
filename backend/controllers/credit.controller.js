const { QueryTypes } = require('sequelize');
const db = require('../db/psql');

module.exports.getOwnCredits = async (req, res) => {
    try {
        const credits = await db.sequelize.query(`SELECT c.money, u.name FROM credits as c INNER JOIN users as u ON c.creator_id = u.id WHERE c.user_id = ${ req.userId } ORDER BY created_at DESC;`, { type: QueryTypes.SELECT });

        res.status(200).json(credits);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(400);
    }
}

module.exports.getUserCredits = async (req, res) => {
    try {
        const credits = await db.sequelize.query(`SELECT c.money, u.name FROM credits as c INNER JOIN users as u ON c.creator_id = u.id WHERE c.user_id = ${ req.params.id } ORDER BY created_at DESC;`, { type: QueryTypes.SELECT });

        res.status(200).json(credits);
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
    console.log(req.params.id);

    try {
        const updatedMoney = await db.sequelize.transaction(async t => {
            const payment = await db.Credit.findOne({ where: { id: req.params.id }}, { transaction: t });
            if (!payment) throw new Error('Payment not found');

            const user = await db.User.findOne({ where: { id: payment.userId }}, { transaction: t });
            if (!user) throw new Error('User not found');

            const updatedUser = await user.increment('money', { by: (payment.amount * drink.price) }, { transaction: t });

            await payment.destroy({ transaction: t });

            return updatedUser.money;
        })

        res.status(200).json({ money: updatedMoney });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
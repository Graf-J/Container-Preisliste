const { QueryTypes } = require('sequelize');
const db = require('../db/psql');

module.exports.getOwnCategories = async (req, res) => {
    try {
        const categories = await db.sequelize.query(`SELECT COALESCE(c.name, 'Other') AS name, SUM(ud.amount) AS total FROM user_drinks AS ud INNER JOIN drinks AS d ON ud.drink_id = d.id LEFT JOIN categories AS c ON d.category_id = c.id WHERE ud.user_id = ${ req.userId } GROUP BY c.id ORDER BY total DESC;`, { type: QueryTypes.SELECT });

        res.status(200).json(categories);
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.getUsersCategories = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new Error('Type Error');

        const categories = await db.sequelize.query(`SELECT COALESCE(c.name, 'Other') AS name, SUM(ud.amount) AS total FROM user_drinks AS ud INNER JOIN drinks AS d ON ud.drink_id = d.id LEFT JOIN categories AS c ON d.category_id = c.id WHERE ud.user_id = ${ req.userId } GROUP BY c.id ORDER BY total DESC;`, { type: QueryTypes.SELECT });

        res.status(200).json(categories);
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.getOwnDrinks = async (req, res) => {
    try {
        const drinks = await db.sequelize.query(`SELECT d.name, SUM(ud.amount) AS total FROM user_drinks AS ud INNER JOIN drinks AS d ON ud.drink_id = d.id WHERE ud.user_id = ${ req.userId } GROUP BY d.id ORDER BY total DESC;`, { type: QueryTypes.SELECT });
        
        res.status(200).json(drinks);
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.getUsersDrinks = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new Error('Type Error');

        const drinks = await db.sequelize.query(`SELECT d.name, SUM(ud.amount) AS total FROM user_drinks AS ud INNER JOIN drinks AS d ON ud.drink_id = d.id WHERE ud.user_id = ${ id } GROUP BY d.id ORDER BY total DESC;`, { type: QueryTypes.SELECT });

        res.status(200).json(drinks);
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.getOwnPaymentPerWeekday = async (req, res) => {
    try {
        const paymentPerWeekday = await db.sequelize.query(`SELECT EXTRACT(dow from ud.created_at) AS weekday, SUM(ud.amount * d.price) AS total FROM user_drinks AS ud INNER JOIN drinks AS d ON ud.drink_id = d.id WHERE user_id = ${ req.userId } GROUP BY weekday ORDER BY weekday ASC;`, { type: QueryTypes.SELECT });

        res.status(200).json(paymentPerWeekday);
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports.getUsersPaymentPerWeekday = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new Error('Type Error');

        const paymentPerWeekday = await db.sequelize.query(`SELECT EXTRACT(dow from ud.created_at) AS weekday, SUM(ud.amount * d.price) AS total FROM user_drinks AS ud INNER JOIN drinks AS d ON ud.drink_id = d.id WHERE user_id = ${ id } GROUP BY weekday ORDER BY weekday ASC;`, { type: QueryTypes.SELECT });

        res.status(200).json(paymentPerWeekday);
    } catch (err) {
        res.sendStatus(400);
    }
}
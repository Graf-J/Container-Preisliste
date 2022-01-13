const db = require('../db/psql');

const handleError = (err) => {
    const error = String(err);

    if (error.includes('already exists')) {
        return error.split(':')[1].trim();
    } else {
        return 'Unknown Error';
    }
}

module.exports.add = async (req, res) => {
    try {
        const user = await db.User.findOne({ where: { name: req.body.name }})

        if (user) {
            throw Error(`User ${req.body.name} already exists`);
        }

        await db.User.create({
            name: req.body.name
        })

        res.status(200).send('Ok');
    } catch(err) {
        const error = handleError(err);
        res.status(400).json({ error })
    }
}
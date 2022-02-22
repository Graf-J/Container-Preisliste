const db = require('../db/psql');

const handleError = (err) => {
    const error = String(err);

    if (error.includes('already exists')) {
        return error.split(':')[1].trim();
    } else {
        return 'Unknown Error';
    }
}

module.exports.get = async (req, res) => {
    try {
        const users = await db.User.findAll({ attributes: ['id', 'name', 'role', 'active', 'money'], order: [['role', 'DESC'], 'createdAt'] });
        result = [];
        users.forEach(user => {
            result.push({
                id: user.id,
                name: user.name,
                role: user.role,
                active: user.active,
                money: user.money
            })
        })
        res.status(200).json(result);
    } catch(err) {
        res.status(400).json({ error: err });
    }
}

module.exports.add = async (req, res) => {
    try {
        let user = await db.User.findOne({ where: { name: req.body.name }})

        if (user) {
            throw Error(`User ${req.body.name} already exists`);
        }

        user = await db.User.create({
            name: req.body.name
        })

        res.status(200).send({
            id: user.id,
            name: user.name,
            role: user.role,
            active: user.active,
            money: user.money
        });
    } catch(err) {
        const error = handleError(err);
        res.status(400).json({ error })
    }
}

module.exports.toggleRole = async (req, res) => {
    try {
        const user = await db.User.findOne({ where: { id: req.params.id }})
        
        if (!user) {
            throw new Error('User not found');
        }

        if (user.role === 'admin') {
            user.role = 'user';
        } else {
            user.role = 'admin';
        }

        await user.save();

        res.status(200).json({
            id: user.id,
            name: user.name,
            role: user.role,
            active: user.active,
            money: user.money
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports.resetPassword = async (req, res) => {
    try {
        const user = await db.User.findOne({ where: { id: req.params.id }})
        
        if (!user) {
            throw new Error('User not found');
        }

        user.password = null
        await user.save();

        res.status(200).send({
            id: user.id,
            name: user.name,
            role: user.role,
            active: user.active,
            money: user.money
        })
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

module.exports.delete = async (req, res) => {
    try {
        const user = await db.User.findOne({ where: { id: req.params.id }})
        
        if (!user) {
            throw new Error('User not found');
        }

        await user.destroy();

        res.status(200).send('Ok');
    } catch (err) {
        res.status(400).send(err);
    }
}
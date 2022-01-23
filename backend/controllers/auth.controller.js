const db = require('../db/psql');
const jwt = require('jsonwebtoken');

const handleError = (err) => {
    if (err.message === 'No User found') {
        return 404;
    } else if (err.message === 'User already signed up') {
        return 406;
    } else {
        return 401;
    }
}

// maxAge: 1 Day
const maxAge = 24 * 60 * 60;
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

module.exports.signup = async (req, res) => {
    try {
        const user = await db.User.findOne({ where: { name: req.body.name }})
        if (!user) {
            throw new Error('No User found');
        }
        if (user.password) {
            throw new Error('User already signed up');
        }

        // Set Password
        user.password = req.body.password;
        await user.save();

        const token = generateToken(user.id, user.role);
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000
        });
        res.status(201).json({ 
            name: user.name,
            money: user.money,
            jwt: token
        });

    } catch(err) {
        const errorCode = handleError(err);
        res.status(errorCode).send('Signup failed');
    }
}

module.exports.login = async (req, res) => {
    try {
        const user = await db.User.login(req.body.name, req.body.password);
        const token = generateToken(user.id, user.role);
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000,
        });
        res.json({
            name: user.name,
            money: user.money,
            jwt: token
        })
    } catch(err) {
        const errorCode = handleError(err);
        res.status(errorCode).send('Login failed');
    }
}

module.exports.logout = (_req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.json({ msg: "logged out" });
}
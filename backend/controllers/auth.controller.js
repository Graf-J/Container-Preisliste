const db = require('../db/psql');
const jwt = require('jsonwebtoken');

const handleError = (err) => {
    try {
        const error = String(err);

        if (error.includes('user.username cannot be null')) {
            return 'Username is required';
        } else if (error.includes('Username is required')) {
            return 'Username is required';
        } else if (error.includes('WHERE parameter "name" has invalid "undefined" value')) {
            return 'Username is required';
        } else if (error.includes('user.password cannot be null')) {
            return 'Password is required';
        } else if (error.includes('Password is required')) {
            return 'Password is required';
        } else if (error.includes('Password has to be at least 8 Characters long')) {
            return 'Password has to be at least 8 Characters long';
        } else if (error.includes('No User found')) {
            return 'No User found';
        } else if (error.includes('Invalid Password')) {
            return 'Invalid Password';
        } else if (error.includes('Invalid Username')) {
            return 'Invalid Username';
        } else if (error.includes('User already signed up')) {
            return 'User already signed up';
        } else {
            return 'Unknown Error';
        }
    } catch {
        return 'Unknown Error';
    }
}

// maxAge: 1 Week
const maxAge = 7 * 24 * 60 * 60;
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

module.exports.signup = async (req, res) => {
    try {
        const user = await db.User.findOne({ where: { name: req.body.name }})
        if (!user) {
            throw new Error('Invalid Username');
        }
        if (user.password) {
            throw new Error('User already signed up');
        }

        // Set Password
        user.password = req.body.password;
        await user.save();

        const token = generateToken(user.id, user.role);
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000,
            httpOnly: true
        });
        res.status(201).json({ 
            name: user.name,
            jwt: token
        });

    } catch(err) {
        const error = handleError(err);
        res.status(401).json({ error });
    }
}

module.exports.login = async (req, res) => {
    try {
        const user = await db.User.login(req.body.name, req.body.password);
        const token = generateToken(user.id, user.role);
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000,
            httpOnly: true
        });
        res.json({
            name: user.name,
            jwt: token
        })
    } catch(err) {
        const error = handleError(err);
        res.status(400).json({ error });
    }
}

module.exports.logout = (_req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.json({ msg: "logged out" });
}
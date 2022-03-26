const jwt = require('jsonwebtoken');

const requireUserAuthSession = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(403).json({ error: 'Token is required' });
    }
    const token = req.headers.authorization.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.status(403).json({ error: err });
            } else {
                req.userId = decodedToken.id;
                next();
            }
        })
    } else {
        res.status(403).json({ error: 'Token is required' });
    }
}

const requireAdminAuthSession = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(403).json({ error: 'Token is required' });
    }
    const token = req.headers.authorization.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.status(403).json({ error: err });
            } else {
                if (decodedToken.role === 'admin') {
                    req.userId = decodedToken.id;
                    next();
                } else {
                    res.status(403).json({ error: 'Admin rights required' });
                }
            }
        })
    } else {
        res.status(403).json({ error: 'Token is required' });
    }
}

module.exports = {
    requireUserAuthSession,
    requireAdminAuthSession
}
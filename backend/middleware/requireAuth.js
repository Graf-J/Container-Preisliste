const jwt = require('jsonwebtoken');

const requireUserAuth = (req, res, next) => {
    const token = req.cookies.jwt;

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

const requireAdminAuth = (req, res, next) => {
    const token = req.cookies.jwt;

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
    requireUserAuth,
    requireAdminAuth
}
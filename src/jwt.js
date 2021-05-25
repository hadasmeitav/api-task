const config = require('../config.json');
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    let error = false;
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, config.jwt.secret, (err, user) => {
        if (err) {
            error = true;
            return;
        }

        req.user = user;
        next();
    });

    if (error) {
        res.sendStatus(401);
    } else {
        return jwt.decode(token);
    }
};
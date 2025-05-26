// utils/jwt.util.js
const jwt = require('jsonwebtoken');

const signToken = (payload, secret, options) => {
    return jwt.sign(payload, secret, options);
};

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

module.exports = { signToken, verifyToken };
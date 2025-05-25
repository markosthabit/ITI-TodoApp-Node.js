const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const verifyToken = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ message: 'authorization header is required' });
        }

        const payload = jwt.verify(authorization, process.env.JWT_SECRET);
        const user = await User.findOne({ username: payload.username });
        if (!user) {
            res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token', error });
    }
};


const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    next();
};



module.exports = { verifyToken, isAdmin };

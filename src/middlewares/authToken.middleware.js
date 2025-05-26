const User = require('../models/user.model');
var { verifyToken } = require('../utils/jwt.util');

const authToken = async (req, res, next) => {
    try {

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'authorization token is required' });
        }

        const payload = verifyToken(token, process.env.JWT_SECRET);
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
    console.log("isAdmin check");
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    next();
};



module.exports = { verifyToken: authToken, isAdmin };

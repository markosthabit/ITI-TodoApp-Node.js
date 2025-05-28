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


function checkRole(rolesArray) {
    if (!(Array.isArray(rolesArray) && rolesArray.length > 0)) {
        throw new Error('Invalid roles array!');
    }
    return async function _checkRole(req, res, next) {
        if (!rolesArray.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Not Authorized!' });
        }
        next();
    };
}





module.exports = { verifyToken: authToken, checkRole };

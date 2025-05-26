const User = require('../models/user.model');
const { scryptSync, randomBytes, timingSafeEqual } = require('node:crypto');

var { signToken } = require('../utils/jwt.util');


/**
 * Create a new user
 * POST /users
 */
register = async (req, res) => {
    try {
        const { username, password, firstName, lastName, dateOfBirth = '' } = req.body;

        // Basic validation
        if (!username || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const salt = randomBytes(16).toString('base64');
        const hashedPassword = scryptSync(password, salt, 64).toString('base64');

        await User.insertOne({
            username: username,
            password: `${salt}:${hashedPassword}`,
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth
        });

        return res.status(201).json({ message: "User Created Succesfully", username: username });
    } catch (err) {
        if (err.message.includes('duplicate key error')) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        if (['validator', 'validation'].some(str => err.message.toLowerCase().includes(str))) {
            console.error(err);
            return res.status(409).json({ error: `Entered user Data is not valid` });

        }

        console.error('createUser error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Login
 * Post /users
 */
login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = await User.findOne({ username: username }, { username: 1, password: 1 });
        const [salt, key] = user.password.split(':');
        const hashedBuffer = scryptSync(password, salt, 64);
        const keyBuffer = Buffer.from(key, 'base64');
        const match = timingSafeEqual(hashedBuffer, keyBuffer);
        if (match) {
            const token = signToken(
                {
                    username: user.username,
                    userId: user._id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '1d' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use true in production (HTTPS)
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            res.json({ message: 'Logged in successfully' });
        }
        else {
            return res.status(401).json({ message: 'Invalid Authentication Credentials!' });
        }

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
};


module.exports = { register, login };
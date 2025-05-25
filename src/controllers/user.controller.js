// src/controllers/user.controller.js
const User = require('../models/user.model');
const { scryptSync, randomBytes, timingSafeEqual } = require('node:crypto');

/**
 * Create a new user
 * POST /users
 */
createUser = async (req, res) => {
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
loginUser = async (req, res) => {
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
            return res.status(200).json({ message: `User ${username} Logged-in Succesfully` });
        }
        else {
            return res.status(401).json({ message: 'Invalid Authentication Credentials!' });
        }

    } catch (err) {
        console.error('createUser error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Retrieve a single user by ID
 * GET /users/:id
 */
getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error('getUserById error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * List all users
 * GET /users
 */
getAllUsers = async (_req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).json({ error: 'No Users found' });
        }
        return res.status(200).json(users);
    } catch (err) {
        console.error('getAllUsers error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update an existing user
 * Patch /users/:id
 */
updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, dateOfBirth } = req.body;

        const updated = await User.findOneAndUpdate({ _id: id }, { firstName, lastName, dateOfBirth }, { new: true });

        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ message: 'User updated successfully', updatedUser: await User.findById(id) });
    } catch (err) {
        console.error('updateUser error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Delete a user
 * DELETE /users/:id
 */
deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.findOneAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ deletedUser: deleted }).send();
    } catch (err) {
        console.error('deleteUser error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createUser, getUserById, getAllUsers, updateUserById, deleteUserById }
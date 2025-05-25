// src/controllers/user.controller.js
const User = require('../models/user.model');


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

module.exports = { getUserById, getAllUsers, updateUserById, deleteUserById };
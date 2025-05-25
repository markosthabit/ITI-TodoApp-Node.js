const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


// Retrieve all users
router.get('/', userController.getAllUsers);

// get a user by ID
router.get('/:id', userController.getUserById);

// Update a user by ID
router.patch('/:id', userController.updateUserById);

// Delete a user by ID
router.delete('/:id', userController.deleteUserById);

module.exports = router;

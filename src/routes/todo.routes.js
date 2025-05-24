const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');

// Create a new todo
router.post('/', todoController.createTodo);

// Retrieve all todos with optional filters
router.get('/', todoController.getTodos);

// Update a todo by ID
router.patch('/:id', todoController.updateTodoById);

// Delete a todo by ID
router.delete('/:id', todoController.deleteTodoById);

module.exports = router;
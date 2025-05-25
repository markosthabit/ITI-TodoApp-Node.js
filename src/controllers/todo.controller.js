const Todo = require('../models/todo.model');

/**
 * Create a new todo
 * POST /users
 */
const createTodo = async (req, res) => {
    try {
        const { title, tags = [] } = req.body;
        const creator_Id = req.user._id;
        if (!title) {
            return res.status(400).json({ error: 'Missing required field: title' });
        }
        const todo = await Todo.insertOne({ title: title, tags: tags, creator_Id: creator_Id });
        return res.status(200).json({ message: "Todo Created successfully", createdTodo: todo });
    } catch (err) {
        console.error('creteTodo error: ', err);
        return res.status(500).json({ error: 'Internal server error' });

    }

};


/**
 * Retrieve todos with the specific required filters
 * GET /todos/?limit=$limit&skip=$skip&status=$value
 */

const getTodos = async (req, res) => {
    const { limit = 10, skip = 0, status } = req.query;
    if (!status) {
        return res.status(400).json({ error: 'Missing required field: status' });
    }
    const todos = await Todo.find({ status: status, creator_Id: req.user._id }, [{ limit: limit }, { skip: skip }]);
    res.body = todos;
    return res.status(200).json({ message: "Todos retrieved successfully", retrievedTodos: todos });
};

/**
 * Update an existing todo
 * Patch /todo/:id
 */

const updateTodoById = async (req, res) => {
    const { id } = req.params;
    const { title, status, tags } = req.body;

    const updatedTodo = await Todo.findOneAndUpdate({ _id: id }, { title: title, status: status, tags: tags }, { new: true });

    return res.status(200).json({ message: "Todo Updated successfully", updatedTodo: updatedTodo });
}

/**
 * Delete a todo by id
 * DELETE /todo/:id
 */

const deleteTodoById = async (req, res) => {
    try {
        const { id } = req.params;;
        await Todo.findOneAndDelete(id);
        return res.status(200).json({ messgae: `Todo with id ${id} deleted successfully` });
    }
    catch (err) {

    }

}



module.exports = { createTodo, getTodos, updateTodoById, deleteTodoById };
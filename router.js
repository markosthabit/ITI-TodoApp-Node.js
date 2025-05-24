const router = require('express').Router();

const todosRoute = require('./src/routes/todo.routes');
const usersRoute = require('./src/routes/user.routes');

router.use('/todos', todosRoute);
router.use('/users', usersRoute);

module.exports = router;
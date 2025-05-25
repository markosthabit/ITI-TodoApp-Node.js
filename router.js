const router = require('express').Router();


const userAuthRoute = require('./src/routes/userAuth.routes');
const usersRoute = require('./src/routes/user.routes');
const todosRoute = require('./src/routes/todo.routes');

const { verifyToken, isAdmin } = require('./src/middlewares/authToken.middleware');

router.use('/auth', userAuthRoute)

router.use('/todos', verifyToken, todosRoute, (req, res) => {
    // Handle fetching todos using req.payload.username or req.payload.userId
    res.json({ message: 'Todos for ' + req.user.username });
}
);

router.use('/users', usersRoute, verifyToken, isAdmin, (req, res) => {
    res.json({ message: 'Admin access granted' });
});






module.exports = router;
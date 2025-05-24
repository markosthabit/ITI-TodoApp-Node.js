const path = require('path');
const express = require('express');
// const initSqlite = require('./src/database/sqlite.database').initSqlite;
const initMongoose = require('./src/database/mongoose.database')
const app = express();
const port = 3000;

const appRouter = require('./router');
app.use(express.static(path.join(__dirname, './public')));

// Initiate the db connection
// sqliteInit();
initMongoose();

app.use('/', express.json(), appRouter);

app.listen(port, () => {
    console.log(`Example router listening on port ${port}`)
})

//? why does res.json() return a promise here?
// ? howcome we used it before without async and without then()?

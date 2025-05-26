const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const initMongoose = require('./src/database/mongoose.database')
require('dotenv').config({ path: './src/.env' });

const app = express();
const port = 3000;

const appRouter = require('./router');
app.use(express.static(path.join(__dirname, './public')), cookieParser());

// Initiate the db connection
initMongoose();

app.use('/', express.json(), appRouter);

app.listen(port, () => {
    console.log(`Example router listening on port ${port}`)
})


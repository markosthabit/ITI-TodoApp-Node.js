const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const initMongoose = require('./src/database/mongoose.database')
require('dotenv').config({ path: './src/.env' });

const app = express();

const appRouter = require('./router');
app.use(
    cors({
        origin: `http://127.0.0.1:${process.env.CLIENT_PORT}`,
        credentials: true,
    })
);
app.use(express.static(path.join(__dirname, './public')), cookieParser());


// Initiate the db connection
initMongoose();

app.use('/', express.json(), appRouter);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Example router listening on port ${port}`)
})


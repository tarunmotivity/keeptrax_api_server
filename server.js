require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const config = require('./config/config');
const logger = config.getLogger('server.js');
const { authorizeUser } = require('./helper/authorization');

const app = express();

/**
 * Debug Logs
 */
app.use((req, res, next) => {
    console.log("==================================");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("RAW HEADERS:", req.rawHeaders);
    console.log("HEADERS:", req.headers);
    console.log("Content-Type:", req.headers['content-type']);
    next();
});

/**
 * CORS
 */
app.use(cors());

/**
 * Body Parsers
 */
app.use(bodyParser.json({
    limit: '50mb',
    verify: (req, res, buf) => {
        console.log("RAW BODY:", buf.toString());
    }
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

/**
 * Static Files
 */
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

/**
 * Authorization
 */
app.use(authorizeUser);

/**
 * Routes
 */
require('./api/routes/routes')(app);

/**
 * MongoDB Events
 */
mongoose.connection.on('connected', function () {
    console.log('successfully connected to mongodb');
});

mongoose.connection.on('error', function (error) {
    logger.error('error------->', error);
});

/**
 * Mongo Connection
 */
mongoose.connect(config.dbUri, config.options);

/**
 * View Engine
 */
app.set('view engine', 'ejs');

/**
 * Health Check
 */
app.get('/', function (req, res) {
    res.send('welcome to KeepTrax');
});

/**
 * Start Server
 */
app.listen(config.port, () => {
    console.log(`server is running on port ${config.port}`);
    logger.info('server is up');
});
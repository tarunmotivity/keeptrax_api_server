const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config/config');
const logger = config.getLogger('server.js');
const { authorizeUser } = require('./helper/authorization');

const app = express()

app.use((req, res, next) => {
    console.log("==================================");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Content-Type:", req.headers["content-type"]);
    next();
});

app.use(bodyParser.json({
  verify: (req, res, buf) => {
    console.log("RAW BODY:", buf.toString());
  }
}));
app.use(cors())
app.use(authorizeUser);
require('./api/routes/routes')(app)

mongoose.connection.on("connected", function () {
    console.log('successfully connected to mongodb')
});

mongoose.connection.on("error", function (error) {
    logger.error("error------->", error);
});


mongoose.connect(config.dbUri, config.options);
app.set("view engine", "ejs");

app.get('/', function (req, res) {
    res.send('welcome to KeepTrax')
})


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.listen(config.port, () => {
    console.log(`server is running on port ${config.port}`)
    logger.info('server is up')
})

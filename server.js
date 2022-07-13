const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config/config');
var logger = config.getLogger('server.js');

const app = express()

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

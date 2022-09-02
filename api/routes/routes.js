// const express = require('express')
var authenticationRoutes = require('./authentication.routes');
var userRoutes = require('./users.routes');
var visitRoutes=require('./trax.routes');
const adminRoutes = require('./admin.routes')
var cors=require('cors')



module.exports = function (app) {
    // app.use(express.json())
    // app.use(cors())
    app.use('/',adminRoutes)
    app.use('/', authenticationRoutes)
    app.use('/', userRoutes)
    app.use('/',visitRoutes)
}
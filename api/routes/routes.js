const express = require('express')
var authenticationRoutes = require('./authentication.routes')
var userRoutes = require('./users.routes')



module.exports = function (app) {
    app.use(express.json())
    app.use('/', authenticationRoutes)
    app.use('/', userRoutes)
}
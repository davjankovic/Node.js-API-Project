/**
 *  Created by Accelerar on 3/6/2018.
 */
// Root path
global.APP_ROOT_PATH = __dirname + '/app/';
// Set other app paths
require('./config/global-paths');
// Set config variables
global.config = require('./config');

// Create an Express App
const express = require('express');
const app = express();
var path = require('path');
// Include dependencies
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require(APP_ROUTE_PATH);
const ValidationManager = require(APP_MANAGER_PATH + 'validation');
const authManager = require(APP_MANAGER_PATH + 'auth');
const validationManager = new ValidationManager();

var multer = require('multer');

// Connect to DB
mongoose.Promise = global.Promise;
mongoose.connect(config.db.MONGO_CONNECT_URL);
// Use json formatter middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authManager.providePassport().initialize());
// app.engine("html", require("ejs").renderFile);
// app.set("view engine", "html");
// app.set("view engine", "ejs");
// Set Up validation middleware
app.use(validationManager.provideDefaultValidator());


app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods',
     'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
})

// Setup routes
app.use('/', routes);

// app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(express.static('public'));

app.listen(global.config.server.PORT, function() {
    console.log('App is running on ' + global.config.server.PORT);
});
const port = 4000;

const mySqlConnection = require('./db/mySqlWrapper');
const accessTokenDBHelper = require('./db/accessTokensDBHelper')(mySqlConnection);
const userDBHelper = require('./db/userDBHelper')(mySqlConnection);
const oAuthModel = require('./auth/accessTokenModel')(userDBHelper, accessTokenDBHelper);
const oAuth2Server = require('node-oauth2-server');
const express = require('express');
const expressApp = express();
expressApp.oauth = oAuth2Server({
    model: oAuthModel,
    grants: ['password'],
    debug: true
});

const restrictedAreaRoutesMethods = require('./routes/restrictedAreaRoutesMethods.js');
const restrictedAreaRoutes = require('./routes/restrictedAreaRoutes.js')(express.Router(), expressApp, restrictedAreaRoutesMethods);
const authRoutesMethods = require('./auth/authRoutesMethods')(userDBHelper);
const authRoutes = require('./auth/authRoutes')(express.Router(), expressApp, authRoutesMethods);
const bodyParser = require('body-parser');

//set the bodyParser to parse the urlencoded post data
expressApp.use(bodyParser.urlencoded({ extended: true }));

//set the oAuth errorHandler
expressApp.use(expressApp.oauth.errorHandler());

//set the authRoutes for registration and & login requests
expressApp.use('/auth', authRoutes);

//set the restrictedAreaRoutes used to demo the accesiblity or routes that ar OAuth2 protected
expressApp.use('/routes', restrictedAreaRoutes);

//init the server
expressApp.listen(port, () => {
    console.log('listening on port ' + port);
});
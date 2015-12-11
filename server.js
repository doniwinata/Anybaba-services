var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var userController= require("./controller/users.js");
var authController= require("./controller/auth.js");
var oauthController= require("./controller/oauth.js");
var app  = express();
var jwt = require("jsonwebtoken");
var config = require("./config.js");

function REST(){
  var self = this;
  self.connectMysql();
};
//connection to MySQL database
REST.prototype.connectMysql = function() {
  var self = this;
  var pool      =    mysql.createPool({
    connectionLimit : 100,
    host     : 'sql6.freemysqlhosting.net',
    user     : 'sql699488',
    password : 'iPjbKfY2X9',
    database : 'sql699488',
    debug    :  false
  });
  pool.getConnection(function(err,connection){
    if(err) {
      self.stop(err);
    } else {
      self.configureExpress(connection);
    }
  });
}
//router to services.js
REST.prototype.configureExpress = function(connection) {
  var self = this;
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  //register controller
  var auth = new authController(connection);
  router = express.Router();
  router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp

    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {

        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {

       //check if it is our client
       
       if(decoded.client_id == config.client_id && decoded.client_secret == config.client_secret)
       {
         next();
       }
       else {
        return res.status(403).send({ 
          success: false, 
          message: 'You are not Allowed for this request!' 
        });
      }   
    }
  });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
      success: false, 
      message: 'No token provided.' 
    });
    
  }
});
  app.use('/*',router);
  app.use('/backend/users', new userController(connection,auth));
 // app.use('/oauth', new oauthController(connection));



  self.startServer();
}
// setting local server on port 3000 
REST.prototype.startServer = function() {
  app.listen(process.env.PORT || 3000,function(){
    console.log("All right ! I am alive at Port 3000.");
  });
}

REST.prototype.stop = function(err) {
  console.log("ISSUE WITH MYSQL \n" + err);
  process.exit(1);
}

new REST();
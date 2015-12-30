var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var userController= require("./controller/users.js");
var authController= require("./controller/auth.js");
var productController = require('./controller/products.js');
var cartController = require('./controller/carts.js');
var orderController = require('./controller/orders.js');
var app  = express();
var jwt = require("jsonwebtoken");
var config = require("./config.js");
var validator  = require('express-validator');
var helmet  = require('helmet');
var fs = require('fs');
var https = require('https');
var options = {
 key  : fs.readFileSync('server.key'),
 cert : fs.readFileSync('server.crt')
};

function REST(){
  var self = this;
  self.connectMysql();
};
//connection to MySQL database
REST.prototype.connectMysql = function() {
  var self = this;
 /* var pool      =    mysql.createPool({
    connectionLimit : 100,
    host     : 'sql6.freemysqlhosting.net',
    user     : 'sql699488',
    password : 'iPjbKfY2X9',
    database : 'sql699488',
    debug    :  false
  });
*/
var pool      =    mysql.createPool({
  connectionLimit : 100,
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'final_ws',
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
       +new Date;
       var now =Math.round(Date.now()/1000); 
       var min = now-5;
       var max = now + 5;
       console.log(decoded.timestamp);
       console.log(now);
       
       if(decoded.client_id == config.client_id  && decoded.timestamp >= min && decoded.timestamp <= max)
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

app.use(validator());
//sanitize 
app.use(function(req, res, next) {
  for (var item in req.body) {
    req.sanitize(item).escape();
  }
  //console.log(item);
  next();
});
//deny iframe
app.use(helmet.xframe());

// hide express information
app.use(helmet.hidePoweredBy());

app.use(helmet.xssFilter());
//define allowed 
app.use(helmet.csp({
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"],
  styleSrc: ["'self'"],
  imgSrc: ['self'],
  connectSrc: ["'none'"],
  fontSrc: [],
  objectSrc: [],
  mediaSrc: [],
  frameSrc: []
}));


app.use('/*',router);
app.use('/backend/users', new userController(connection,auth));
app.use('/backend/products', new productController(connection,auth));
app.use('/backend/carts', new cartController(connection,auth));
app.use('/backend/orders', new orderController(connection,auth));
 // app.use('/oauth', new oauthController(connection));



 self.startServer();
}
// setting local server on port 3000 
REST.prototype.startServer = function() {
  https.createServer(options, app).listen(3000, function () {
    console.log('All right ! I am alive at Port 3000.');
 });
  /*app.listen(process.env.PORT || 3000,function(){
    console.log("All right ! I am alive at Port 3000.");
  });*/
}

REST.prototype.stop = function(err) {
  console.log("ISSUE WITH MYSQL \n" + err);
  process.exit(1);
}

new REST();
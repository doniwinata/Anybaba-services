var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var userController= require("./controller/users.js");
var authController= require("./controller/auth.js");
var app  = express();

function REST(){
  var self = this;
  self.connectMysql();
};
//connection to MySQL database
REST.prototype.connectMysql = function() {
  var self = this;
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
  app.use('/backend/users', new userController(connection,auth));
  


  self.startServer();
}
// setting local server on port 3000 
REST.prototype.startServer = function() {
  app.listen(3000,function(){
    console.log("All right ! I am alive at Port 3000.");
  });
}

REST.prototype.stop = function(err) {
  console.log("ISSUE WITH MYSQL \n" + err);
  process.exit(1);
}

new REST();
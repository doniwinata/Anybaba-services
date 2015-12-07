var mysql = require("mysql");
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

function NEW_AUTH(connection) {
return this.basicAuth(connection);
}

NEW_AUTH.prototype.basicAuth= function(connection) {

  function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }
  passport.use(new BasicStrategy(
  function(username, password, callback) {

    var query = "SELECT * FROM ?? where email = ? and password = ? ";
    var table = ["users", username, password];
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query, function(err,user){
      if(err){
       
        return callback(err); 
      }else{

        if (!isEmptyObject(user)) {
          
           return callback(null, user);
        } else {
         
         return callback(null, false);
        }
      }
    });
  }
));

return passport.authenticate('basic', { session : false });
  
}


module.exports = NEW_AUTH;
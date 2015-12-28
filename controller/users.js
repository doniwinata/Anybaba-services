var mysql = require("mysql");
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var config = require("../config.js");
function NEW_ROUTER(connection,auth) {
  var self = this;
  return self.handleRoutes(connection,auth);
}

NEW_ROUTER.prototype.handleRoutes= function(connection,auth) {

  function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }
  
  router.get("/",function(req,res){
    var query = "SELECT * FROM ?? ";
    var table = ["users"];
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query, function(err,results){
      if(err){
        res.json({"Error": true,"Message" : "Connection Error"});
      }else{

        if (!isEmptyObject(results)) {

          res.json({"Error": false, "Message" : "Login Success", "Users" : results});
        } else {
          res.json({"Error": false, "Message" : "User Not Found / Incorrect Password !", "Users" : ""}) 
        }
      }
    });
  });

  router.get("/checkemail/:email",function(req,res){
    var query = "SELECT * FROM ?? where email = ? and type = ?";
    var table = ["users", req.params.email,'1'];
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query, function(err,results){
      if(err){
        res.json({"Error": true});
      }else{

        if (!isEmptyObject(results)) {

          res.json({"Error": true});
        } else {
          res.json({"Error": false}) 
        }
      }
    });
  });
  // register new member
  router.post("/addmember",function(req,res){

  //  console.log(pass);

  console.log( 'Data Sent: ' + req.body.data);
  jwt.verify(req.body.data, config.secret, function(err, decoded) {      
    if (err) {

      return res.json({ success: false, message: 'Failed to authenticate token.' });    
    } else {
      bcrypt.genSalt(5, function(err, salt) {
        if (err) return err;

        bcrypt.hash(decoded.password, salt, null, function(err, hash) {
          if (err) return err;

          var insert = find('users', 'email', req.body.email, function(val){

            if(!val){
             var query = "INSERT INTO ??(email,password,credentials,updated_at,created_at,first_name, last_name) VALUES (?, ? ,?,NOW(),NOW(), ?,?)";
             var table = ["users", decoded.email, hash, 'member', decoded.first_name, decoded.last_name];

             query = mysql.format(query,table);
             console.log(query);
             connection.query(query, function(err,results){
              if(err){
                res.json({"Error": true,"Message" : err});
              }else{

                if (!isEmptyObject(results)) {

                  res.json({"Error": false, "Message" : "Sign Up Success"});
                } else {
                  res.json({"Error": true, "Message" : "Failed! Retry again"}) 
                }

              }
            }); 

           }
           else{
             var query = "UPDATE ?? SET ?? =?, ?? = ?   where ?? = ?  ";
             var table = ["users",'password',hash,'type','1','email', req.body.email];

             query = mysql.format(query,table);
             console.log(query);
             connection.query(query, function(err,results){
              if(err){
                res.json({"Error": true,"Message" : err});
              }else{

                if (!isEmptyObject(results)) {

                  res.json({"Error": false, "Message" : "Sign Up Success"});
                } else {
                  res.json({"Error": true, "Message" : "Failed! Retry again"}) 
                }

              }
            });
           }
         });


});
});
}
});

});

router.post("/adduser",function(req,res){

  //  console.log(pass);
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return err;

    bcrypt.hash(req.body.password, salt, null, function(err, hash) {
      if (err) return err;


      var query = "INSERT INTO ??(email,password,credentials,updated_at,created_at,first_name, last_name) VALUES (?, ? ,?,NOW(),NOW(), ?,?)";
      var table = ["users", req.body.email, hash, req.body.credentials, req.body.first_name, req.body.last_name];

      query = mysql.format(query,table);
      console.log(query);
      connection.query(query, function(err,results){
        if(err){
          res.json({"Error": true,"Message" : err});
        }else{

          if (!isEmptyObject(results)) {

            res.json({"Error": false, "Message" : "Sign Up Success"});
          } else {
            res.json({"Error": true, "Message" : "Failed! Retry again"}) 
          }

        }
      }); 

    });
  });

});
  //login user
  router.post("/login",function(req,res){
    console.log('data sent : ' + req.body.data);
   jwt.verify(req.body.data, config.secret, function(err, decoded) {      
    if (err) {

      return res.json({ success: false, message: 'Failed to authenticate token.' });    
    } else {
      var query = "SELECT * FROM ?? where email = ?";
      var table = ["users", decoded.email];
      query = mysql.format(query,table);
     
      connection.query(query, function(err,user){
        if(err){
          res.json({"Error": true});
        }else{

          if (!isEmptyObject(user)) {
          //if email user found
          bcrypt.compare(decoded.password, user[0]['password'], function(err, isMatch) {
            if (err) {return err;}
            else{
              if(isMatch)
              {
                var object = {"Error": false,"email": user[0]['email'], "name":user[0]['first_name'], "credentials": user[0]['credentials'], "id" : user[0]['id']}
                var data = jwt.sign(object,config.secret);
                console.log('data response: ' + data);
                res.json(data); 
              }else{
                res.json({"Error": true})
              }
            }     

          });
        } else {
          res.json({"Error": true}) 
        }
      }
    });
    }
  });

});


router.post("/addoauth",function(req,res){
 var insert = find('oauth', 'user_id', req.body.user_id, function(val){
  console.log(val);
  if(!val)
  {
    var  query = "INSERT  INTO ??(type, user_name, user_id, user_email, credentials, created_at) VALUES (?,?,?,?,?, NOW())";
    var table = ["oauth", req.body.type, req.body.user_name, req.body.user_id, req.body.user_email, req.body.credentials];
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query, function(err,results){
      if(err){
        res.json({"Error": true,"Message" : err});
      }else{

        if (!isEmptyObject(results)) {

            //res.json({"Error": false, "Message" : "Sign Up Success"});

            //insert into user

            var insert = find('users', 'email', req.body.user_email, function(val){
              console.log(val);
              if(!val)
              {
                var query = "INSERT INTO ??(email,password,credentials,updated_at,created_at,first_name,type) VALUES (?, ? ,?,NOW(),NOW(), ?,2)";
                var table = ["users", req.body.user_email,'-','member', req.body.user_name];
                query = mysql.format(query,table);
                console.log(query);
                connection.query(query, function(err,results){
                  if(err){
                    res.json({"Error": true,"Message" : err});
                  }else{

                    if (!isEmptyObject(results)) {
                      res.json({"Error": false, "Message" : "Sign Up Success"});
                    } else {
                      res.json({"Error": true, "Message" : "Failed! Retry again"}) 
                    }

                  }
                });
              }
              else
              {
               res.json({"Error": false, "Message" : "Sign Up Success"});
             }

           });



} else {
  res.json({"Error": true, "Message" : "Failed! Retry again"}) 
}

}
});
}
else
{
 res.json({"Error": false, "Message" : "Sign Up Success"});
}

});

});


var find = function(table, attribute, value, callback)
{
  var query = "SELECT * FROM ?? where "+attribute+" = ?";
  var table = [table, value];
  query = mysql.format(query,table);
  console.log(query);
  connection.query(query, function(err,user){
    if(err){
      callback(false);
    }else{

      if (!isEmptyObject(user)) {
        callback(true);
      } else {
        callback(false); 
      }
    }
  });
}

router.get("/members",function(req, res){

  var query ="SELECT  * from ?? where ?? = ? and ?? != ?";

  var table = ['users','credentials','member','status','deleted'];
  query = mysql.format(query,table);
  console.log(query);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query"});
    } else {
      res.json(rows);
    }
  });
});

router.get("/members/find/:id",function(req, res){

  var query ="SELECT  * from ?? where ?? = ? and ?? = ?";

  var table = ['users','credentials','member','id',req.params.id];
  query = mysql.format(query,table);
  console.log(query);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query"});
    } else {

      res.json(rows);
    }
  });
});

router.post("/findEmail",function(req, res){

  var query ="SELECT  * from ?? where ?? = ?";

  var table = ['users','email',req.body.email];
  query = mysql.format(query,table);
  console.log(query);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query"});
    } else {

      res.json(rows);
    }
  });
});

router.get("/members/delete/:id",function(req, res){

  var query ="UPDATE  ?? set ?? = ? where ?? = ?";

  var table = ['users','status','deleted','id',req.params.id];
  query = mysql.format(query,table);
  console.log(query);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query"});
    } else {

      res.json({"Error" : false, "Message" : "Deleted"});
    }
  });
});



return router;
}


module.exports = NEW_ROUTER;
var mysql = require("mysql");
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
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
    var query = "SELECT * FROM ?? where email = ? ";
    var table = ["users", req.params.email];
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
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return err;

    bcrypt.hash(req.body.password, salt, null, function(err, hash) {
      if (err) return err;


      var query = "INSERT INTO ??(email,password,credentials,updated_at,created_at,first_name, last_name) VALUES (?, ? ,?,NOW(),NOW(), ?,?)";
      var table = ["users", req.body.email, hash, 'member', req.body.first_name, req.body.last_name];

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
    var query = "SELECT * FROM ?? where email = ?";
    var table = ["users", req.body.email];
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query, function(err,user){
      if(err){
        res.json({"Error": true});
      }else{

        if (!isEmptyObject(user)) {
          //if email user found
          bcrypt.compare(req.body.password, user[0]['password'], function(err, isMatch) {
            if (err) {return err;}
            else{
              if(isMatch)
              {
                res.json({"Error": false,"email": user[0]['email'], "name":user[0]['first_name'], "credentials": user[0]['credentials'], "id" : user[0]['id']}) 
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
  });


  router.post("/addoauth",function(req,res){
   var insert = findTrue('oauth', 'user_id', req.body.user_id, function(val){
    console.log(val);
    if(val)
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

 });


  var findTrue = function(table, attribute, value, callback)
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
          callback(false);
        } else {
          callback(true); 
        }
      }
    });
  }
  router.get("/registerWatchList/:user_id/:movie_id",function(req, res){

    var datetime = new Date();
    var date = datetime.getFullYear()+"-"+datetime.getMonth()+"-"+datetime.getDate();
    console.log(date);
    var query = "INSERT INTO ??(??,??,status,modifiedDate) VALUES (?,?,'watch list','"+ date +"')";
    var table = ["watchlist","user_id","movie_id",req.params.user_id,req.params.movie_id];
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query,function(err,results){
      if(err) {
        res.json({"Error" : true, "Message" : err});
      } else {
        res.json({"Error" : false, "Message" : "watch list added"});
      }
    });
  })

  router.get("/findMemberWatch/:member_id",function(req,res){
    var query ="SELECT  Mov.*, W.*"+
    " FROM  watchlist W inner join member M inner JOIN movie Mov  ON W.user_id = M.user_id AND W.movie_id = Mov.movie_id"+
    " WHERE M.user_id = ? AND W.status = 'watch list';";

    var table = [req.params.member_id];
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

  router.get("/findAllMovie",function(req,res){
    var query = "SELECT * FROM ?? ";
    var table = ["movie"];
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
  router.post("/findMoviebyTitle",function(req,res){
    var query = "SELECT * FROM ?? WHERE title = ? ";
    var table = ["movie",req.body.title];
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

  router.post("/findMoviebyId",function(req,res){
    var query = "SELECT * FROM ?? WHERE movie_id = ?" ;
    var table = ["movie", req.body.id];
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

  router.get("/memberList",function(req,res){
    var query = "SELECT user_id, username FROM ?? " ;
    var table = ["member"];
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


  router.get("/movieList",function(req,res){
    var query = "SELECT movie_id, title FROM ?? " ;
    var table = ["movie"];
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

  return router;
}


module.exports = NEW_ROUTER;
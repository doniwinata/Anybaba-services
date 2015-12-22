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
    var query = "SELECT * FROM ?? where status != ?";
    var table = ['products', 'deleted'];
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query, function(err,results){
      if(err){
        res.json({"Error": true,"Message" : "Connection Error"});
      }else{

        if (!isEmptyObject(results)) {

          res.json(results);
        } else {
          res.json({"Error": true, "Message" : "Prodcuts Not Found"}) 
        }
      }
    });
  });

  router.get("/categories/:type",function(req,res){
    console.log(req.params.type);
    var query = "SELECT * FROM ?? where status != ? and type = ?";
    var table = ['products', 'deleted',req.params.type];
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query, function(err,results){
      if(err){
        res.json({"Error": true,"Message" : "Connection Error"});
      }else{

        if (!isEmptyObject(results)) {

          res.json(results);
        } else {
          res.json({"Error": true, "Message" : "Prodcuts Not Found"}) 
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
  router.post("/add",function(req,res){
    console.log('wew');
    //console.log(req.body.data);
    var query = "INSERT INTO ??(name,price,picture_name,description,status, type,created_at, updated_at)  VALUES (?, ? ,?, ?,?,?,NOW(),NOW())";
    var table = ['products', req.body.name, req.body.price, req.body.picture_name, req.body.description, req.body.status, req.body.type];

    query = mysql.format(query,table);
    console.log(query);
    connection.query(query, function(err,results){
      if(err){
        res.json({"Error": true,"Message" : err});
      }else{

        if (!isEmptyObject(results)) {

          res.json({"Error": false, "Message" : "Row Added !"});
        } else {
          res.json({"Error": true, "Message" : "Failed! Retry again"}) 
        }

      }
    }); 



  });

   router.post("/edit",function(req, res){
   
    var query ="UPDATE ?? SET name = ?, price = ?, description = ?, status = ?, type = ?, picture_name = ?,  updated_at = NOW()  where id = ? ";
//name,price,picture_name,description,status, type,created_at, updated_at
    var table = ['products',req.body.name,req.body.price,req.body.description,req.body.status,req.body.type,req.body.picture_name,req.body.id];
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query,function(err,rows){
      if(err) {
        res.json({"Error" : true, "Message" : "Error executing MySQL query"});
      } else {

         res.json({"Error": false, "Message" : "Row Updated !"});
      }
    });
  });

  router.get("/find/:id",function(req, res){
   
    var query ="SELECT  * from ?? where ?? = ? ";

    var table = ['products','id',req.params.id];
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

  router.get("/delete/:id",function(req, res){

    var query ="UPDATE  ?? set ?? = ? where ?? = ?";

    var table = ['products','status','deleted','id',req.params.id];
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
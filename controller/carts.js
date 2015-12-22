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

  /*router.get("/:user_id",function(req,res){
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
  });*/

  // register new cart
  router.post("/add",function(req,res){
    console.log('wew');
    //check if already exist
    var query = "SELECT * from  ?? where ??=? and ??=?";
    var table = ['carts','products_id',req.body.products_id, 'user_id',req.body.user_id];
    
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query, function(err,results){
      if(err){
        res.json({"Error": true,"Message" : err});
      }else{

        if (!isEmptyObject(results)) {
         //  console.log(results);
         res.json({"Error": false, "Message" : "Product Already in Cart !"});
       } else {
          //console.log('results');
          var query = "INSERT INTO ??(products_id,user_id,created_at)  VALUES (?, ?,NOW())";
          var table = ['carts', req.body.products_id, req.body.user_id];

          query = mysql.format(query,table);
          console.log(query);
          connection.query(query, function(err,results){
            if(err){
              res.json({"Error": true,"Message" : err});
            }else{

              if (!isEmptyObject(results)) {

                res.json({"Error": false, "Message" : "Cart Added !"});
              } else {
                res.json({"Error": true, "Message" : "Failed! Retry again"}) 
              }

            }
          }); 


        }

      }
    });  



});


router.get("/find/:user_id",function(req, res){

  var query = "SELECT  c.id,p.name,p.picture_name, p.price "+
  " FROM  carts c inner join products p ON p.id = c.products_id"+
  " WHERE c.user_id = ?;";
  var table = [req.params.user_id];
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

router.post("/delete",function(req,res){
  var query = "DELETE FROM ?? WHERE id = ?";
  var table = ['carts', req.body.id];

  query = mysql.format(query,table);
  console.log(query);
  connection.query(query, function(err,results){
    if(err){
      res.json({"Error": true,"Message" : err});
    }else{
      res.json({"Error": false, "Message" : "Cart Deleted !"});
    }
  }); 

  



});




return router;
}


module.exports = NEW_ROUTER;
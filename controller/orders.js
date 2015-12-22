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

  

  // register new order
  router.get("/:user_id",function(req,res){
    console.log(req.params.user_id);
    //add new order
    var code = (+new Date()).toString(36);
    var query = "insert into ?? (code,user_id,status,created_at) values(?,?,?,NOW())";
    var table = ['orders',code,req.params.user_id,'ordering'];
    
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query, function(err,results){
      if(err){
        res.json({"Error": true,"Message" : err});
      }else{

          //get item
          
          var query = "SELECT products_id from ?? where ?? = ?";
          var table = ['carts', 'user_id', req.params.user_id];
          query = mysql.format(query,table);
          console.log(query);
          connection.query(query, function(err,results){
            if(err){
              res.json({"Error": true,"Message" : err});
            }else{

              if (!isEmptyObject(results)) {
                for (var i in results) {
                  val = results[i];

                  
                  var query = "insert into ?? (code,products_id) values(?,?)";
                  var table = ['order_product',code, val.products_id];

                  query = mysql.format(query,table);
                  console.log(query);
                  connection.query(query, function(err,results){
                    if(err){
                      res.json({"Error": true,"Message" : err});
                    }else{
                        //next();
                      };
                    });
                }
              } else {
                res.json({"Error": true, "Message" : "Failed! Retry again"}) 
              }

              //delete carts

              var query = "delete from ?? where ??=?";
              var table = ['carts','user_id', req.params.user_id];

              query = mysql.format(query,table);
              console.log(query);
              connection.query(query, function(err,results){
                if(err){
                  res.json({"Error": true,"Message" : err});
                }else{
                  res.json({"Message" : 'Order Success!'});
               };
             });
            }

          });
}  

});

});


router.get("/histories/:user_id",function(req, res){

  var query = "SELECT  o.code as code, o.status as status, o.created_at as created_at,sum(p.price) as total "+
  " FROM  orders o inner join order_product op inner join products p ON o.code = op.code and op.products_id = p.id"+
  " WHERE o.user_id = ? group by(o.code);";
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
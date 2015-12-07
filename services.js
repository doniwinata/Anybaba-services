var mysql = require("mysql");
var express = require('express');
var router = express.Router();
function NEW_ROUTER(connection,md5) {
	var self = this;
	return self.handleRoutes(connection,md5);
}

NEW_ROUTER.prototype.handleRoutes= function(connection,md5) {

	function isEmptyObject(obj) {
		return !Object.keys(obj).length;
	}
	
	router.get("/",function(req,res){
		
	});
	
	router.get("/checkUser/:username/:password",function(req,res){
		var query = "SELECT * FROM ?? WHERE ??=? AND ?? =?";
		var table = ["member","username",req.params.username,"password", req.params.password];
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
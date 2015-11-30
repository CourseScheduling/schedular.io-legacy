var express = require('express');
var router = express.Router();
var crypto  =   require('crypto');
var mysql      = require('mysql');
var ses     =   require('node-ses');

var connection = mysql.createConnection({
  host     : 'schedule.cpfi2ocm03x0.us-west-2.rds.amazonaws.com',
  user     : 'joseph',
  password : 'joseph123',
  database : 'ufv'
});
connection.connect();


router.get('/', function(req,res,next){
    res.render('user/continue'); 
    if(req.query.code===undefined){
        //res.redirect('/');
        return;
    }
    connection.query('SELECT id FROM user WHERE uniqString=?',[req.query.code],function(e,r,v){
        if(e) throw e;
        if(r.length>0){
            connection.query('UPDATE userlogin SET active=1 WHERE userId=?',[r[0].id],function(e,r,v){
        if(e) throw e;
            });
        }else{
            //res.redirect('/');
        }
    });
});
module.exports  =   router;

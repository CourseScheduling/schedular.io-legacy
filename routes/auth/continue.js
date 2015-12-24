var express = require('express');
var router = express.Router();
var crypto  =   require('crypto');
var mysql      = require('mysql');
var ses     =   require('node-ses');

var DB = require('../../bin/db.js');
		
router.get('/', function(req,res,next){
    res.render('auth/continue'); 
    if(req.query.code===undefined){
        //res.redirect('/');
        return;
    }
    DB.query('SELECT id FROM user WHERE uniqString=?',[req.query.code],function(e,r,v){
        if(e) throw e;
        if(r.length>0){
            DB.query('UPDATE userlogin SET active=1 WHERE userId=?',[r[0].id],function(e,r,v){
        if(e) throw e;
            });
        }else{
            //res.redirect('/');
        }
    });
});
module.exports  =   router;

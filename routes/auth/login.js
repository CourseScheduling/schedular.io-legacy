var express = require('express');
var router = express.Router();
var crypto  =   require('crypto');
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'schedule.cpfi2ocm03x0.us-west-2.rds.amazonaws.com',
  user     : 'joseph',
  password : 'joseph123',
  database : 'ufv'
});

connection.connect();

ValidateMod =   {
    validate:function(u,p,cb){
        console.log('SEARCHING FOR USER '+u);
        connection.query('SELECT userId,password FROM userlogin WHERE( username=? AND active="1")',[u],function(e,r,v){
            if (e) throw e;
            if(r.length==0){
                console.log('USER '+u+' Not found');
                cb&&cb(false,'BAD_USERNAME');
                return;
            }
            var passwordSalt    =   r[0].password.slice(0,10);
            var hashedPassword  =   crypto.createHash('sha512').update(passwordSalt+p).digest('base64');
            if(hashedPassword===r[0].password.substr(10))
                cb&&cb(true,r[0]);
            else
                cb&&cb(false,'WRONG_PASSWORD');
        });
    }
}

UserMod =   {
    grabUser:function(uId,cb){
        connection.query('SELECT * FROM user WHERE id=?',[uId],function(e,r,v){
            cb&&cb(r[0]);
        });
    }
}

SessionMod  =   {
    addData:function(req,data,cb){
        req.session.userData    =   data;
        req.session.loggedIn    =   true;
        req.session.save(function(e){
            cb&&cb();
        });
    }
}

router.post('/',function(req,res,next){
    req.body.u  =   req.body.u.toLowerCase();
    ValidateMod.validate(req.body.u,req.body.p,function(good,reason){
        if(!good){
            res.send([reason]);
            return;
        }
        
        UserMod.grabUser(reason.userId,function(data){
            SessionMod.addData(req,data,function(){
                res.send(['SUCCESS']);
            });
        });
    });
});




module.exports  =   router;

var express = require('express');
var router = express.Router();
var crypto  =   require('crypto');
var mysql      = require('mysql');
var ses     =   require('node-ses')
var sesClient   =   ses.createClient({
    key:'AKIAIWVGEVPTLIA5GI7Q',
    secret:'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',
    amazon:'https://email.us-west-2.amazonaws.com'
});
var connection = mysql.createConnection({
  host     : 'schedule.cpfi2ocm03x0.us-west-2.rds.amazonaws.com',
  user     : 'joseph',
  password : 'joseph123',
  database : 'ufv'
});




connection.connect();
var ValidateMod   =   {
    validate:function(username,password,student,cb){
        var _this   =   this;
        
        _this.good(username,password,student,function(good,reason){
            
            if(!good)
                return cb&&cb(good,reason);
            
            _this.existsUsername(username,function(good){
                if(!good)
                    return cb&&cb(good,'USERNAME_EXISTS');

                _this.existsStudent(student,function(good){
                    return cb&&cb(good,'STUDENT_EXISTS');
                });
            });
        });
    },
        
    good:function(username,password,student,cb){
        var _this   =   this;
        if(username.match(/[^a-zA-Z\d_-]/g)!==null)
            return cb&&cb(false,'INVALID_USERNAME');
        if(username.length>40)
            return cb&&cb(false,'LONG_USERNAME');
        if(student.length!==9||student.match(/[^\d]/g)!==null)
            return cb&&cb(false,'INVALID_STUDENT');
        if(password.length>200)
            return cb&&cb(false,'LONG_PASSWORD');
        
        return cb&&cb(true,'');
        
    },
    existsUsername:function(data,cb){
        connection.query('SELECT userId FROM userlogin WHERE username=?',[data],function(e,r,v){
            if(e) throw e;
            cb&&cb(r<1);    
        });
    },
    existsStudent:function(data,cb){
        connection.query('SELECT id FROM user WHERE studentNumber=?',[data],function(e,r,v){
            cb&&cb(r<1);
        });
    
    }
}

var InsertMod   =   {
    insertUser:function(username,password,student,cb){
        var uniqExpiry  =   Date.now()/1000+172800;
        var uniqString  =   'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                var r = crypto.randomBytes(1)[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                return v.toString(16);
                            });
        var salt    =   (Math.random().toString(36)).slice(2,12);
        var hashedPassword  =   salt+crypto.createHash('sha512').update(salt+password).digest('base64');
        connection.query('INSERT INTO user(studentNumber,uniqString,uniqExpire,joinDate) VALUES(?,?,?,?)',[student,uniqString,uniqExpiry,Date.now()/1000],function(err,r){
            connection.query('INSERT INTO userlogin VALUES(?,?,?,?)',[r.insertId,username,hashedPassword,0],function(err,r){
                if(err) throw err;
                EmailMod.sendWelcome(uniqString,student,cb);
            }); 
        });
        
    }
}


router.post('/',function(req,res,next){  
    req.body.u  =   req.body.u.toLowerCase();
    ValidateMod.validate(req.body.u,req.body.p,req.body.s,function(good,reason){
        if(!good){
            res.send([reason]);
            return;
        }
        console.log('good');
        InsertMod.insertUser(req.body.u,req.body.p,req.body.s,function(){
            res.send(['SUCCESS']);
        });
    });
});

var EmailMod    =   {
    sendWelcome:function(uniq,student,cb){
        console.log('here');
        sesClient.sendEmail({
           to: student+'@my.ufv.ca'
         , from: 'info@schedular.io'
         , subject: 'Activate your account'
         , message: "<html> <div style='border:1px solid #DDD;display:inline-block;width:400px;height:700px;position:relative;left:50%;margin-left:-200px;padding:20px;'> <div style='color:#444444;font-size:11pt;width:400px;position:relative;left:50%;margin-left:-200px;font-family:proxima_nova,Open Sans,Lucida Grande,Segoe UI,Arial,Verdana,Lucida Sans Unicode,Tahoma,Sans Serif;font-weight:100;line-height:30px;'>Hey, Thanks for registering! All you have to do now is click the button below. It's really that simple. Thanks Again.</div><a href='http://www.schedular.io/continue?code=ACTIVE_CODE'> <div style='position:relative;left:50%;margin-left:-60px;margin-top:50px;color:#fff;background-color:#3498db;padding:20px;border-radius:1px solid #DDD;display:inline-block;border-radius:5px;font-size:11pt;font-family:proxima_nova,Open Sans,Lucida Grande,Segoe UI,Arial,Verdana,Lucida Sans Unicode,Tahoma,Sans Serif;font-weight:400;cursor:pointer' title='activate'>ACTIVATE!</div></a> <div style='position:absolute;bottom:0px;left:0px;height:40px;width:100px;border-top:1px solid #DDD;width:100%;'> <img src='127.0.0.1:3000/images/mainLogo.png' height='30px' width='30px' style='margin:5px'> </div></div></html>".replace('ACTIVE_CODE',uniq)
        }, function (err, data, res) {
            cb&&cb();
        });
    }
}
    

module.exports  =   router;

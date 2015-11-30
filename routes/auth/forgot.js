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

router.get('/continue',function(req,res,next){

});


router.post('/', function(req,res,next){
    var student     =   req.body.s;
    console.log(student);
    if(student.length!==9||student.match(/[^\d]/g)!==null){
        res.send(['INVALID_STUDENT']);
        return;
    }
    connection.query('SELECT id FROM user WHERE studentNumber=?',[student],function(e,r,v){
        if(r.length>0){
            ConfirmMod.send(student,function(){
                res.send(['SUCCESS']);
            });
        }else{
            res.send(['NO_STUDENT']);
            return;
        }
    });
});

var ConfirmMod  =   {
    send:function(s,cb){
        
        var uniqString  =   'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = crypto.randomBytes(1)[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        
        
        connection.query('UPDATE user SET uniqString=?,uniqExpire=? WHERE studentNumber=?',[uniqString,Date.now()+172800000,s],function(e,r,v){
            if(e)
                throw e;
            EmailMod.send(uniqString,s,cb);
        });
    }
}






var EmailMod    =   {
    send:function(uniq,student,cb){
        sesClient.sendEmail({
           to: student+'@my.ufv.ca'
         , from: 'info@schedular.io'
         , subject: 'Password Reset'
         , message: '<html><head></head><body><div style="border:1px solid #DDD;display:inline-block;width:400px;height:700px;position:relative;left:50%;margin-left:-200px;padding:20px;"> <div style="color:#444444;font-size:11pt;width:400px;position:relative;left:50%;margin-left:-200px;font-family:proxima_nova,Open Sans,Lucida Grande,Segoe UI,Arial,Verdana,Lucida Sans Unicode,Tahoma,Sans Serif;font-weight:100;line-height:30px;">Hey, we recieved your password reset request. Just click the button below to reset your password. If you didn'+"'"+'t request this, just ignore this email.</div><a href="http://www.schedular.io/forget?part=2&code=FORGOT_CODE"> <div style="position:relative;left:50%;margin-left:-75px;margin-top:50px;color:#fff;background-color:#3498db;padding:20px;border-radius:1px solid #DDD;display:inline-block;border-radius:5px;font-size:11pt;font-family:proxima_nova,Open Sans,Lucida Grande,Segoe UI,Arial,Verdana,Lucida Sans Unicode,Tahoma,Sans Serif;font-weight:400;cursor:pointer" title="Reset">Reset Password!</div></a> <div style="position:absolute;bottom:0px;left:0px;height:40px;width:100px;border-top:1px solid #DDD;width:100%;"> <img src="127.0.0.1:3000/images/mainLogo.png" height="30px" width="30px" style="margin:5px"> </div></div></body></html>'.replace('FORGOT_CODE',uniq)
        }, function (err, data, res,cb) {
            console.log(err,data);
            cb&&cb();
        });
    }
}
module.exports  =   router;

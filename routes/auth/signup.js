var express	=	require('express');
var router	=	express.Router();

var crypto	=	require('crypto');

var mysql		=	require('mysql');
var ses			=	require('node-ses');

var sesClient   =   ses.createClient({
    key:'AKIAIWVGEVPTLIA5GI7Q',
    secret:'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',
    amazon:'https://email.us-west-2.amazonaws.com'
});

var DB      =   require('../../bin/db.js');



var Validate;
var Insert;
var ACTIVATION_EMAIL_TEMPLATE;

router.post('/',function(req,res,next){  
	req.body.username  =   req.body.username.toLowerCase();
	//Do some basic validation
  Validate.checkBody(req.body,function(body){
		//Send errors back to user
		if(!body[0])
			return res.send([body[1]]);
		//If passed, do some Database based evaluation
		Validate.validateDB(body[1],function(uniId){
			if(!uniId[0])
				return res.send([uniId[1]]);
			//Finally, create the user if everything is good.
			Insert.createUser(body[1],uniId[1],function(body){
				//Send success to client
				res.send([body[0]]);
				Insert.sendEmail(body[1]);
			});
		})
	});
});




var Insert	=	(function(){
	
	function createUser(body,uniId,cb){
		
		
		//Create a unique id for this new user, to activate his acc
		var uniq	=   'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = crypto.randomBytes(1)[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
		});

		//Set an expiry date for said activation key
		var expire	=	Math.round(Date.now()/1000)+172800;
		console.log([uniId,body.email.split('@')[0],body.email.split('@')[1],uniq,expire,Math.round(Date.now()/1000),'student']);
		//Insert base user into db and get insertId
		DB.query("INSERT INTO user.user (universityId,emailUser,emailDomain,uniqString,uniqExpire,joinDate,accountType) VALUES (?,?,?,?,?,?,?)",[uniId,body.email.split('@')[0],body.email.split('@')[1],uniq,expire,Math.round(Date.now()/1000),'student'],function(e,user){
				if(e) throw e;
				
				//We can now generate a password
				
        var salt    =   (Math.random().toString(36)).slice(2,12);
        var hashedPassword  =   salt+crypto.createHash('sha512').update(salt+body.password).digest('base64');
				
				//Store this as login info
				DB.query("INSERT INTO user.userlogin (userId,username,password,active) VALUES (?,?,?,?)",[user.insertId,body.username,hashedPassword,0],function(e,r){
					if(e) throw e;
					//Yell back the success with the info needed to send an activation email
					return cb&&cb(['SUCCESS',[body.email,uniq]]);
				});
			}
		);
	}
	
	function sendVerif(body,cb){
		
		sesClient.sendEmail({
			 to: body[0]
		 , from: 'info@schedular.io'
		 , subject: 'Activate your account'
		 , message: ACTIVATION_EMAIL_TEMPLATE.replace('ACTIVE_CODE',body[1]).replace('FIRST_NAME',body[0].split('.')[0].capitalize())
		}, function (err, data, res) {
			cb&&cb();
		});
	}
	
	return {
		createUser:createUser,
		sendEmail:sendVerif
	};
	
})();



var Validate  =	(function(){
	function checkBody(body,cb){
		// Check if the values even exist
		if(body.username==undefined||body.username=="")
			return cb&&cb([false,'NO_USERNAME']);
		if(body.password==undefined||body.password=="")
			return cb&&cb([false,'NO_PASSWORD']);
		if(body.email==undefined||body.email=="")
			return cb&&cb([false,'NO_EMAIL']);

		//check if the values are good
		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

		if(body.username.match(/[^a-zA-Z\d_-]/g)!==null)
			return cb&&cb([false,'INVALID_USERNAME']);
		if(body.username.length>40)
			return cb&&cb([false,'LONG_USERNAME']);
		if(body.password.length>200)
			return cb&&cb([false,'LONG_PASSWORD']);
		if(!emailRegex.test(body.email))
			return cb&&cb([false,'BAD_EMAIL']);
		if(body.email.split('@')[0].match(/[a-zA-Z]/g)==null)
			return cb&&cb([false,'NUMBER_EMAIL']);

		return cb&&cb([true,body]);

	}

	function validateDB(body,cb){
		//check if email domain is legit, if so, grab the uni associated with it.
		DB.query("SELECT universityId FROM general.university_emails WHERE general.university_emails.domain=?",[body.email.split('@')[1]],function(e,uniId){
			if(e) throw e;
			//if the email domain is invalid
			if(uniId==undefined||uniId.length==0)
				return cb&&cb([false,'BAD_DOMAIN']);
			//Okay, this is a valid thingy, 
			var sql	=	"SELECT username FROM user.userlogin WHERE username=?"+
					"UNION"+
					" SELECT emailUser FROM user.user WHERE universityId=? AND user.user.emailUser=?";
			//The values needed are the username, uni Id, and emailId
			DB.query(sql,[body.username,uniId[0].universityId,body.email.split('@')[0]],function(e,r){
				if(e) throw e;
				if(r==undefined||r.length==0)
					return cb&&cb([true,uniId[0].universityId]);
				
				if(r[0].username==body.username)
					return cb&&cb([false,'USERNAME_EXISTS']);
				else
					return cb&&cb([false,'EMAIL_EXISTS']);
					
				
			});
		});
	}

	return {
		checkBody:checkBody,
		validateDB:validateDB
	};
	
})();


//Replace "ACTIVE_CODE" with the activation code
//Replace "FIRST_NAME" with the activation code

var ACTIVATION_EMAIL_TEMPLATE	=	"<html> <div style='border:1px solid #DDD;display:inline-block;width:400px;height:400px;position:relative;left:50%;margin-left:-200px;padding:50px;'> <div style='color:#444444;font-size:11pt;width:400px;position:relative;left:50%;margin-left:-200px;font-family:proxima_nova,Open Sans,Lucida Grande,Segoe UI,Arial,Verdana,Lucida Sans Unicode,Tahoma,Sans Serif;font-weight:100;line-height:30px;'>Hey FIRST_NAME,<br> <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Thanks for registering for Schedular! All you have to do now is click the button below. It's really that simple. Thanks Again!</div><a href='http://www.schedular.io/continue?code=ACTIVE_CODE'> <div style='position:relative;left:50%;margin-left:-60px;margin-top:50px;color:#fff;background-color:#3498db;padding:20px;border-radius:1px solid #DDD;display:inline-block;border-radius:5px;font-size:11pt;font-family:proxima_nova,Open Sans,Lucida Grande,Segoe UI,Arial,Verdana,Lucida Sans Unicode,Tahoma,Sans Serif;font-weight:400;cursor:pointer' title='activate'>Activate!!</div></a> <div style='position:absolute;bottom:0px;left:0px;height:40px;width:100px;border-top:1px solid #DDD;width:100%;'> <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsLCgIohXn95AAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAIHUlEQVRo3tVaXWwc1RX+zt2566zXNraT2Di1I9vJgojlKMQRRvBQUURQq4qopa1aaFFJIxBBIm0eqlIU2pS2qUQhClIfolRRVYScQh/al5bGBfcniopwQmXUFOHEMSGoXv//7Hq8e2fu6cPOrmd2Z3bXfyG+kjXamXPP//nOuVcmZu4CoABMorfXRDyusB5WLBZBd7cEUA+g0gBg4pVXruLUqX0wzZ1IpeQNUyadzjgtHJZF36fTqoAmEjFRU3MBPT19iMVaiZk3oqqqGx0dLyKdBojWRUDADEg5ab377iGDeVT8nGiGk8n2dWUEkNHVsurngRiACeMqYFhARAYZYVlW4v33/8GAru7ouBfhcAQAYBgSluWtJ/c7v+9LWUNDg9MzM8MSCEc7O++FYRh+ZCYQuYXIFFcB2IAIDF88foaBn20AXsDIyKuwbcsxUHkM8FtB70vXjolE4kztI48cs4HjmJjoK7VFFP0aCgF33TVbzfwZybwdDz5owt8xKDDOstSyIxIOKzz3nInXXmurYa5BLDZbaotR9KvWgFJ34O23BxGNKiQSO8BsFDVgNZbWlfjgg524dKkP/f2NyNTBCgwBgNHR+3D0aBuYFUyzOMOV1kUuT4SBy5f34emnu5BOS5hm68oNMQyJublWV86rNTPAzYs5gpmZWNnbSlLk530WBLwwqMAMKKU877O0RN49fjTZ5eYRRO/m6zZkw977p7DrzhJYoItgupBg/amMNpvee28QAAiAvHLlSrp9S8PZpTWkT78nDn0yure9obKDqpsuLaaWIawCp+cHxA+sdUkQB8BrbrlRdlcRy+pEN2ytjhp6hd9vCkP0zRgRvUwOwqkDzQE0ufpQrqdamxrRSynegqXAMEHqLBDeB0D60tjqHBbG+5D66Dqq7mhGuGovEOp2+oxcHUOWn2QKC5OvNt7aMjdqih1sn/8GrM4elzEK6dnerc1NA/EZ3KOBb1kaBoA0gGsS+GnaXugG2w8EOGCtaySTRl/qjD5VvamlaTSJbwLUSfV3hz1Gpmb66jc2zXw8hSfSWtghgT/XVaOnthJ/32CgRgnxDIWjIxChPoDUyiOypAJnwDIvbGnc3Ds+j+8rGAgb1kdpi5vySbe3bOmfWcCTAN7g1DRBhJ6ChgS0wuzVF+padu6YXsBDtKH6OM9P33eDI8Kqa/vmP8YTeEJBXm6IWL+4bRPecnGTAAN2ejiRwu1aVAxwOvkJROhxgGWGTkjUbjvy5nfxhwoD04C4B6BLi9HmguivviFCyMOfw2BNFC/xwviF+HTyZC60tXWLM0wo3DpybFvPv/anToBwJBMJT4eX3T+afFYKjIHpVhD9N4NmlNmvsyBEa5RaAB79TfK3jwIWgIgHSqenPIri4EBPt2YZiIrathxNdaA+2T062P3Cr4DLXBLgSPaHnRVT60MnaLHfeCWqd36w+ZfKRiMIwwB3eZBL+DxFydRiOKihAhqW8hkEc+9CWV7TBY1V+exXEFDQavKhX+OBlC0qofgcmJu9tAyIoMbJxRqiuyk58cyFVEufcdih19JXiHefm7eEVtebmzaemUjh2wgZf+KFycegbbkY7ZxgWU4pG7tz5wtuLTxwsGsCpzwvuH8TKsKwAKBhNywQtwbvg4X5sZ80tmyzx5N4XGv8hVV8FKyf914QaleRF0n5ENXkFTtVAqwAkoAGyEkbJpmF3Mw358kOjXOMFQBDaz06Dw0iCc7v0qwAzH5xV/XDf/sQX05qcSeIXufUZB1YnMzJ9YsskSocYUT2dGoUohaTzDhBoFCRnEEZCCUnXdinfgr2QkFNHdvStHVkPIFnFcRENKJfSkwnj4L1jkXefkfrrC60hD6ygkNcKHA3q3eer+q6pX5r5f9mxdeUxl/5fNuPE1Nzb3iNWK0xnn1SkYPSU2cNVyBXNIQQrjTKPH+3a8/9L+PgrDKao1H9MluJh7H73//JGEDSsz9IPSo98htFoyGgfNLEm0KOEJW5IdSemtDpgYYnr3w1aYXr2jaljw9dn/snNDsp7BjLcPVDEXBqozwFC2mNMgZcVTheB3hKCOESLj88svE7kwt4EWS/OTQ8+nVo81e5RLRtb06QrAGJ/WUdSYkKHFxqRJElDM2dObKo5QaGH/aigYEKMH82VNVguvXWBeoZY5wa2w82TnrqhoQqcKJPlhgl7q5UAArlE8qv7MHghRG8lTo/dTeUBljg92f7Gzdv3/N6ckFX+lz0CwCw7YxNIWGNAPLzAGfkZmW60nf5QyOXERVH6OEzc+cOEwagsDMDzwBqbz89Nj5n5jVQRyZZi7/JAthwoF16eiGVqNPlp5YISC+S0OjyggZJLw8qcl1J7kHB11lloharQIGMDMpwtvsKb6FnhVA590Z5QMHOLEbs6t5icbJYeh8hWTAGMGQ5YV3WKYCdU6RbvlslJulEqSz5RjmI4BUUOIaU4TPtw5NKp63W0hmJ1vjKdK1W/uTAZaWWzvwFXjf6fKMl3BiyDkhD7eXP7nfOjESlr0HFkvI+f/bSeelFurjArJJc7I5Wew13163gQKcZF7NshfCHOHLZnO8Zyjs3sQhGLhJwIZ6PH53vJLxy3eMIc9GIcHtz/WND1+KxgjAXg89VubZ3O4VVSd4uwBn6ON7a3tI4DE0mM0ti5giSozWoiJ4euhb/AtbJam9pGITAWfSf/h66n6knZo4R0fUDB2CdOnDCUBcPWevBELn7hNF18JB18SKYmW8j5x/PZgEMExHd9JC8uGzO/BdGG4DI/wFEl47dw0/fUgAAAABJRU5ErkJggg==' height='30px' width='30px' style='margin:5px;display:inline-block;float:left;'> <div style='font-family:proxima_nova,Open Sans,Lucida Grande,Segoe UI,Arial,Verdana,Lucida Sans Unicode,Tahoma,Sans Serif;font-weight:400;line-height:30px;display:inline-block;margin-left:10px;font-size:12px;margin-top:5px;'>From: the Schedular.io team</div></div></div></html>";


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports  =   router;

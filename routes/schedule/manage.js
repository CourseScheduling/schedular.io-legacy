var express = require('express');
var router = express.Router();

var shortid	=		require('shortid');
var DB      =   require('../../bin/db');

router.get('/',function(req,res,next){
	res.render('main/manage',jadeData(req));
});
router.get('/save',function(req,res,next){
	var id	=	shortid.generate();
	var name	=	req.session.userData.username+"'s schedule";
	req.query.codes	=	req.query.codes.split('.').sort().join('&');
	DB.query('SELECT id FROM user.user_saved_schedules WHERE sections=? AND university=?',
					 [req.query.codes,req.session.userData.universityId],
					 function(e,r){
		if(e)	throw e;
		if(r.length!==undefined&&r.length>0)
			return res.send(['EXISTS']);
		DB.query('INSERT INTO user.user_saved_schedules (shortid,sections,public,university,term,year,user,name,timestamp) VALUES (?,?,?,?,?,?,?,?,?)',
						 [id,req.query.codes,0,req.session.userData.universityId,parseInt(req.query.term),parseInt(req.query.year),req.session.userData.id,name,Date.now()/1000	],
						 function(e,a){
			if(e) throw e;
			res.send(['SUCCESS']);
		});
		
	});
});

router.get('/get',function(req,res,next){
	DB.query('SELECT sections,name,term,year,timestamp,shortid FROM user.user_saved_schedules WHERE user=?',[req.session.userData.id],function(e,r){
		if(e) throw e;
		res.send(r);
	});
});

router.get('/kill',function(req,res,next){
	var _id	=	req.query.shortid;
	DB.query('DELETE from user.user_saved_schedules WHERE shortid=? AND user=?',[_id,req.session.userData.id],function(e){
		if(e)
			return res.send(['ERROR'])
		res.send(['SUCCESS'])
	});
});

router.get('/title',function(req,res,next){
	var _id	=	req.query.shortid;
	var _title	=	req.query.title;
	DB.query('UPDATE user.user_saved_schedules SET title=? WHERE shortid=? AND user=?',[_title,_id,req.session.userData.id],function(e){
		if(e)
			return res.send(['ERROR'])
		res.send(['SUCCESS'])
	});
});

router.get('/:sId',function(req,res,next){
	if(shortid.isValid(req.params.sId)){
			DB.query('SELECT sections,name,term,year FROM user.user_saved_schedules WHERE shortid=?',[req.params.sId],function(e,r){
				if(e) throw e;	
				if(r.length==undefined||r.length<=0)
					return next();
				
				res.render('main/viewer',{schedule:r});
			})
	}else{
		next();
	}
});








function jadeData(req){
	return {
		firstname:req.session.userData.firstname,
		lastname:req.session.userData.lastname,
		student:req.session.userData.studentNumber,
		username:req.session.userData.username
	 }
}

module.exports = router;
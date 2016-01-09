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
	req.query.codes	=	req.query.codes.split('.').sort().join('.');
	DB.query('SELECT id FROM user.user_saved_schedules WHERE sections=? AND university=?',
					 [req.query.codes,req.session.userData.universityId],
					 function(e,r){
		if(e)	throw e;
		if(r.length!==undefined&&r.length>0)
			return res.send(['EXISTS']);
		DB.query('INSERT INTO user.user_saved_schedules (shortid,sections,public,university,term,year,user,name) VALUES (?,?,?,?,?,?,?,?)',
						 [id,req.query.codes,0,req.session.userData.universityId,req.session.userData.term,req.session.userData.year,req.session.userData.id,name],
						 function(e,a){
			if(e) throw e;
			res.send(['SUCCESS']);
		});
		
	});
});

router.get('/get',function(req,res,next){
	console.log(req.session.userData);
	DB.query('SELECT sections,name,term,year FROM user.user_saved_schedules WHERE user=?',[req.session.userData.id],function(e,r){
		if(e) throw e;
		res.send(r);
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
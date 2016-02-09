var express = require('express');
var router = express.Router();

var DB      =   require('../bin/db');
var mongo		=		require('../bin/mongo.js');
var fs	=	require('fs');

router.use(function(req,res,next){
    if(req.session.loggedIn == true)
			next();
    else
			res.send('{comment:"Hah, nice try, this will only work if you are logged in."}');

	return;
})

router.get('/currentTerms',function(req,res,next){
	DB.query('SELECT * FROM general.university_terms WHERE universityId	=	?',[req.session.userData.universityId],function(e,r){
		if(e) throw e;
		res.send(r);
	});
});
router.get('/course', function(req, res, next) {
	req.query.q	=	req.query.q.toLowerCase();
	if(req.query.q.match(/\d/g)!==null)
		req.query.q=req.query.q.replace(/\s/,'');
	var sql	=	'SELECT course.&UNI_course_instant.name,course.&UNI_course_instant.code,course.&UNI_course_instant.tags FROM course.&UNI_course_instant WHERE (course.&UNI_course_instant.code LIKE CONCAT(?,"%") OR MATCH(course.&UNI_course_instant.tags) AGAINST(?) OR CONCAT(?,"%") LIKE course.&UNI_course_instant.name) AND term=? AND year=? LIMIT 50'.replace(/\&UNI/g,req.session.userData.dbName);
	DB.query(sql,[req.query.q,req.query.q,req.query.q,req.query.term,req.query.year],function(e,r,v){
		if(e) throw e;
		res.send(JSON.stringify(r));
	});


});

router.get('/byUniq',function(req,res,next){
	var uniq;
	try{
		uniq	=	JSON.parse(req.query.uniq);
	}catch(e){
		return res.send('[]');
	}
	mongo.get(req.session.userData.dbName+'Course').find({
		$or:[
			{"sections.C.uniq":{$in:uniq.C.map(parseFloat)}},
			{"sections.L.uniq":{$in:uniq.L.map(parseFloat)}},
			{"sections.T.uniq":{$in:uniq.T.map(parseFloat)}}
		]
	},{
	$or:[
			{"sections.C.uniq":{$elemMatch:{$in:uniq.C.map(parseFloat)}}},
			{"sections.L.uniq":{$elemMatch:{$in:uniq.L.map(parseFloat)}}},
			{"sections.T.uniq":{$elemMatch:{$in:uniq.T.map(parseFloat)}}}
		]
	},function(err,docs){
		if(err) throw err;
		res.send(docs);
	});
});

router.get('/instructors',function(req,res,next){
	try{
		req.query.names	=	JSON.parse(req.query.names);
	}catch(e){
		return res.send('[]');
	}

	var sql	=	('SELECT course.&UNI_teacher_rating.teacherName,course.&UNI_teacher_rating.rating,course.&UNI_teacher_rating.votes FROM course.&UNI_teacher_rating WHERE course.&UNI_teacher_rating.teacherName IN ('+(',?'.repeat(req.query.names.length).substr(1))+')').replace(/\&UNI/g,req.session.userData.dbName);
	console.log(sql);

	DB.query(sql,req.query.names,function(e,r){
		if(e) {
			res.send('[]');
			return console.log(e);
		}
		console.log(r.length);
		res.send(JSON.stringify(r)||[]);
	});
});

router.get('/books',function(req,res,next){
	
	var uniq;
	try{
		uniq	=	JSON.parse(req.query.uniq);
	}catch(e){
		return res.send('[]');
	}
	var sql	=	'SELECT crn,price,isbn FROM course.&UNI_books_local WHERE crn IN ('(',?'.repeat(req.query.names.length).substr(1))+')'.replace(/\&UNI/g,req.session.userData.dbName);
	
	DB.query(sql,uniq,function(){
	global.Searcher.itemLookup({
		idType: 'ISBN',
		itemId: '0495391328',
	}, function(error, results,response) {
			if (error) return console.log(JSON.stringify(error));
			res.send(results);
	});
});
});


module.exports = router;

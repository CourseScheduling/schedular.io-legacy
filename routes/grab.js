var express = require('express');
var router = express.Router();

var amazon = require('amazon-product-api');

var BookSearcher = amazon.createClient({
    awsId:     "AKIAIH5J5OH2K7O5VGAQ",
    awsSecret: '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',
    awsTag:    "schedular07-20", 
});

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
			{"sections.C.uniq":{$in:uniq.C}},
			{"sections.L.uniq":{$in:uniq.L}},
			{"sections.T.uniq":{$in:uniq.T}}
		]
	},{
	$or:[
			{"sections.C.uniq":{$elemMatch:{$in:uniq.C}}},
			{"sections.L.uniq":{$elemMatch:{$in:uniq.L}}},
			{"sections.T.uniq":{$elemMatch:{$in:uniq.T}}}
		]
	},function(err,docs){
		if(err) throw err;
		res.send(docs);
	});
});


//Just a poly fill for string repeat
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (;;) {
      if ((count & 1) == 1) {
        rpt += str;
      }
      count >>>= 1;
      if (count == 0) {
        break;
      }
      str += str;
    }
    // Could we try:
    // return Array(count + 1).join(this);
    return rpt;
  }
}





router.get('/profs',function(req,res,next){
	try{
		req.query.names	=	JSON.parse(req.query.names);
	}catch(e){
		return res.send('[]');
	}

	if(!req.query.names||req.query.names.length==0){
		return res.send('[]');
	}
	var sql	=	('SELECT course.&UNI_teacher_rating.name,course.&UNI_teacher_rating.rating,course.&UNI_teacher_rating.votes FROM course.&UNI_teacher_rating WHERE course.&UNI_teacher_rating.name IN ('+(',?'.repeat(req.query.names.length).substr(1))+')').replace(/\&UNI/g,req.session.userData.dbName);
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
	var isbns;
	try{
		isbns	=	JSON.parse(req.query.isbn);
	}catch(e){
		return res.send('[]');
	}
	

	BookSearcher.itemLookup({
		IdType: 'ISBN',
		ItemId: isbns.join(','),
		ResponseGroup:'Offers,ItemAttributes,Images'
	}, function(error, results,response) {
			if (error) {
				//DB.query('DELETE FROM course.ufv_books_local WHERE id=?',isbn.id);
				return console.log(JSON.stringify(error));
			}
		res.send(response);
	});


	
	
	
	
});

router.get('/courses/all/josephisawesome14706978',function(req,res,next){
	
	
	mongo.get(req.session.userData.dbName+'Course').find({},
  function(err,docs){
		res.send(docs);	
	});
	
});

router.get('/courses',function(req,res,next){
	
	var courses	=	(req.query.c||"").split('|');
	if(courses[0]==""&&courses.length==1)
		return res.redirect('/');
	
	mongo.get(req.session.userData.dbName+'Course').find({title:{$in:courses}},
  function(err,docs){
		res.send(docs);	
	});
	
});


module.exports = router;

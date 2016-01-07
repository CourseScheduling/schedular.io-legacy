var express = require('express');
var router = express.Router();

var shortid	=		require('shortid');
var DB      =   require('../../bin/db');

router.get('/',function(req,res,next){
	res.render('main/manage');
});
router.get('/save',function(req,res,next){
	DB.query
	res.send(['SUCCESS']);
});

module.exports = router;
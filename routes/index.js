var express = require('express');
var router = express.Router();
var fs	=	require('fs');

router.use(function(req,res,next){
    //console.log(req.session);
    if(req.session.loggedIn == true)
        res.redirect('/s');
    else
        next();
    
    return;
})

router.get('/', function(req, res, next) {
    res.render('home');
});
router.get('/contact',function(req,res,next){
    res.render('contact');
});
router.get('/invite',function(req,res,next){
    res.render('invite');
});
router.get('/sendEmail',function(req,res,next){
	//put the email in the emails file
	fs.appendFileSync('./public/test/emails',req.query.e+' '+req.query.n+'\n');
	res.send('[]');
});


module.exports = router;
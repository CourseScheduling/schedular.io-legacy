var express = require('express');
var router = express.Router();


/* GET users listing. */

router.use(function(req,res,next){
    if(req.session.loggedIn == true&&req.path!=='/logout')
        res.redirect('/s');
    else
        next();
    return;
})

router.get('/', function(req, res, next) {
    res.redirect('/');
});

router.get('/signup', function(req, res, next) {
  res.render('user/signup');
});

router.get('/login', function(req, res, next) {
  res.render('user/login');
});

router.get('/logout',function(req,res,next){
    req.session.destroy();
    res.redirect('/');
});

router.get('/forgot', function(req, res, next) {
  res.render('user/forgot');
});

router.get('/forgotContinue', function(req, res, next) {
    res.render('user/forgotContinue');
});

module.exports = router;

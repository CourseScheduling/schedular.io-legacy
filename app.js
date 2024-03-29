var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session =   require('express-session');
var crypto  =   require('crypto');
var MemcachedStore = require('connect-memcached')(session);
var nodalytics = require('nodalytics')

var routes	= require('./routes/index');

var search	= require('./routes/schedule/search');
var manager		= require('./routes/schedule/manage');
var build		= require('./routes/schedule/build');

var users		= require('./routes/users');
var grab		= require('./routes/grab');
var profile		= require('./routes/profile');
var books		=	require('./routes/books/books');

var signupAuth = require('./routes/auth/signup');
var loginAuth = require('./routes/auth/login');
var continueAuth = require('./routes/auth/continue');
var forgotAuth = require('./routes/auth/forgot');
var DB = require('./bin/db.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var sessionStore    =    new MemcachedStore({
    hosts: ['schedular.luawsd.cfg.usw2.cache.amazonaws.com:11211'/*,'localhost:11211'*/]
});





//Google Analytics
app.use(nodalytics('UA-43692440-2'));

app.use(favicon(path.join(__dirname, 'public', 'images/mainLogo.png')));
app.use(session({
    genId:function(req){
        return crypto.createHash('sha128').update('SUP_BIG_GUY'+Math.random()+Date.now()+req.connection.remoteAddress).digest('hex')
    },
    cookie  : { maxAge : 7 * 24 * 60 * 60 * 1000 },
    resave  : true,
    secret  : 'Joseph1234567890',
    proxy   : 'true',
    store   : sessionStore
}));



var io  = require('socket.io').listen(app.listen(4342));

app.use(function(req,res,next){
    if(req.session.loggedIn){
        req.io  = io;
    }
    next();
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/forgotAuth', forgotAuth);
app.use('/signupAuth', signupAuth);
app.use('/loginAuth', loginAuth);
app.use('/continue', continueAuth);
app.use('/g', grab);
app.use('/s', search);
app.use('/m', manager);
app.use('/build', build);
app.use('/u', users);
app.use('/p', profile);
app.use('/books',books);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Nice Try');
  err.status = 302;
    res.redirect('/');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session =   require('express-session');
var crypto  =   require('crypto');
//var MemcachedStore = require('connect-memcached')(session);
var nodalytics = require('nodalytics')

var routes = require('./routes/index');
var users = require('./routes/users');
var search = require('./routes/search');

var signupAuth = require('./routes/auth/signup');
var loginAuth = require('./routes/auth/login');
var continueAuth = require('./routes/auth/continue');
var forgotAuth = require('./routes/auth/forgot');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/*

//UNCOMMENT BEFORE UPLOADING TO SERVER 
    //this
    //Meemcachedstore
    //store variable v
var sessionStore    =    new MemcachedStore({
    hosts: ['schedular.luawsd.cfg.usw2.cache.amazonaws.com:11211']
});
*/




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
    proxy   : 'true'
    //, store   : sessionStore
}));


var io  = require('socket.io').listen(app.listen(8080));
io.on('connection', function (socket) {
  global.sockets[socket.id] =   {socket:socket,CRNS:[]};
  socket.emit('news', { hello: 'world' });

    app.use(function(req,res,next){
        if(req.session.loggedIn){
            req.io  = io;
        }else{
            socket.disconnect();
        }
        next();
    });

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
app.use('/s', search);
app.use('/u', users);
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

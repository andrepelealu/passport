//============ requirements ============
var express      = require('express');
var mongoose     = require('mongoose');
var passport     = require('passport');
var flash        = require('connect-flash');
var session      = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var path         = require('path');
var app          = express();
var port         = 5000;

//============ Database ============
mongoose.connect('mongodb://127.0.0.1/users');

//============ Set Up ============
require('./app/passport.js')(passport);

app.use(cookieParser());
app.use(bodyParser());
app.use(flash());
app.use(session({secret: 'this is secret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

//============ Route ============
require('./app/route.js')(app, passport);

//============ Run App ============
app.listen(port);
console.log('runnin on ..' + port);

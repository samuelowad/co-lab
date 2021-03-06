var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var taskRouter = require('./routes/task');
const mongoose = require('mongoose');
const config = require('./config');
const passport = require('passport');
const session = require('express-session');
require('./passport');
var app = express();


mongoose.connect(config.dbConnection);
global.User = require('./models/user');
global.Task = require('./models/task');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: config.sessionKey,
    resave: false,
    saveUnintialized: true
}))

app.use(passport.initialize());
app.use(passport.session())
app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
})
app.use(indexRouter);
app.use(authRouter)
app.use(taskRouter)
    // app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
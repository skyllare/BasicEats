var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const sequelize = require('./db')
const User = require('./models/User')
const MealPlan = require('./models/MealPlan')
const Recipe = require('./models/Recipe');

var indexRouter = require('./routes/index');
var calendarRouter = require('./routes/calendar');
var accountRouter = require('./routes/account');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'wsu489',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use('/', indexRouter);

app.use('/login', indexRouter);
app.use('/aboutus', indexRouter);
app.use('/index', indexRouter);
app.use('/recipe-search', indexRouter);
app.use('/recipe', indexRouter);
app.use('/signup', indexRouter);
app.use('/change_password', accountRouter);
app.use('/myrecipes', accountRouter);
app.use('/saved-recipes', accountRouter);
app.use('/admin', accountRouter);
app.use('/account', accountRouter);
app.use('/calendar', calendarRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (req, res, next) {
  next(createError(404));
});

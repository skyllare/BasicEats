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
app.use('/account', accountRouter);
app.use('/change_password', accountRouter);
app.use('/calendar', calendarRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (req, res, next) {
  next(createError(404));
});

async function setup() {
  const subu = await User.create({ username: "subu", password: "1234", admin: true, recipe_count: 0 });
  const meals = await MealPlan.bulkCreate([
    { username: 'caitlin', day: '2024-04-11', weekday: 'Sunday', mealNum: 1, name: "eggs" },
    { username: 'd', day: '2024-04-12', weekday: 'Monday', mealNum: 1, name: "friday" }
  ]);

  const saladRecipe = await Recipe.create({ recipeid: "subu1", recipename: "salad", ingredients: "lettuce, dressing, croutons, strawberries, candied pecans", recipedesc: "strawberry salad perfect for summer", instructions: "1. Candy pecans \n 2. Clean strawberries and chop them \n 3. Chop lettuce \n 4. Put ingredients in a bowl and toss \n 5. Add dressing", time: 20 });

  console.log("subu instance created...")
}

sequelize.sync({ force: true }).then(() => {
  console.log("Sequelize Sync Completed...");
  setup().then(() => console.log("User setup complete"))
})

module.exports = app;
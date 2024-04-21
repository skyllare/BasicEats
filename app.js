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
const Saved_Recipe = require('./models/Saved_Recipe');

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

async function setup() {
  const subu = await User.create({ username: "subu", password: "1234", admin: true, recipe_count: 1 });
  const meals = await MealPlan.bulkCreate([
    { username: 'caitlin', day: '2024-04-11', weekday: 'Sunday', mealNum: 1, name: "eggs" },
    { username: 'd', day: '2024-04-12', weekday: 'Monday', mealNum: 1, name: "friday" }
  ]);
//',  ', '', 30, 4);
  const saladRecipe = await Recipe.create({ username: 'subu', recipename: "Chicken Gnocchi Soup", ingredients: "3-4 boneless skinless chicken breasts - cooked and diced, 1 stalk of celery - chopped, 1/2 white onion - diced, 2 tsp minced garlic, 1/2 cup shredded carrots, 1 tbsp olive oil, 4 cups low sodium chicken broth, salt and pepper - to taste, 1 tsp thyme, 16 ounces potato gnocchi, 2 cups half and half, 1 cup fresh spinach - roughly chopped ", recipedesc: " Olive Garden Chicken Gnocchi Soup copycat is every bit as creamy and delicious as the restaurant version, made in less than 30 minutes!", instructions: "<ol><li>Heat olive oil in a large pot over medium heat. Add celery, onions, garlic, and carrots and saute for 2-3 minutes until onions are translucent. </li><li>Add chicken, chicken broth, salt, pepper, and thyme, bring to a boil, then gently stir in gnocchi. </li><li>Boil for 3-4 minutes longer before reducing heat to a simmer and cooking for 10 minutes.</li><li>Stir in half and half and spinach and cook another 1-2 minutes until spinach is tender. Taste, add salt and pepper if needed, and serve.</ol>", time: 30, servings: 4 });
  const savedRecipe = await Saved_Recipe.create({recipeid : 649933, username: 'subu', recipename: 'Lentil Soup with Chorizo'})

  console.log("subu instance created...")
}

sequelize.sync({ force: true }).then(() => {
  console.log("Sequelize Sync Completed...");
  setup().then(() => console.log("User setup complete"))
})

module.exports = app;
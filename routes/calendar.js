var express = require('express');
const MealPlan = require('../models/MealPlan')
const User = require('../models/User');
var router = express.Router();


router.get('/', async function (req, res, next) {
  const user = req.session.user;

  // If user is not logged in, redirect to login page
  if (!user) {
    return res.redirect('/login');
  }

  if (req.query.msg) {
    res.locals.msg = req.query.msg
  }
  function getWeekDates() {
    const today = new Date();
    const currentDay = today.getDay();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - currentDay);

    const weekDates = [];
    const date = new Date(firstDayOfWeek); // Create a new Date object here
    for (let i = 0; i < 7; i++) {
      // Formatting the date to display in 'YYYY-MM-DD' format
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      weekDates.push(formattedDate); // Push the formatted date to the array
      date.setDate(date.getDate() + 1); // Increment the date by one day
    }
    return weekDates; // Return the weekDates array
  }

  //console.log(req.session.user)
  try {
    const weekDates = getWeekDates();
    console.log("weekdates:")
    console.log(weekDates)
    const mealplan = await MealPlan.findAll({
      where: {
        //username: currentUser.username,
      }
    });

    //Meake mealsByDay array:
    const mealsByDay = { 'Sunday': {}, 'Monday': {}, 'Tuesday': {}, 'Wednesday': {}, 'Thursday': {}, 'Friday': {}, 'Saturday': {} };
    for (day in mealsByDay) {
      mealsByDay[day] = {
        1: [],
        2: [],
        3: []
      };
    }

    console.log("mealplan:")
    console.log(mealplan)

    mealplan.forEach(meal => {
      mealsByDay[meal.weekday][meal.mealNum].push(meal);
    })
    console.log("mealsbyDay:")

    console.log(mealsByDay)

    console.log(mealplan)
    res.render('calendar', { mealplan: mealplan, mealsByDay: mealsByDay }); // Pass mealplan to the template
  } catch (error) {
    console.error("Error fetching mealplan:", error);
    next(error); // Forward the error to the error handler
  }
});


router.get('/meal/:day/:mealNumber', (req, res) => {
  const { day, mealNumber } = req.params;
  let meal = '';
  switch (day) {
    case 'Sunday':
      meal = 'Meal for Sunday - Meal ' + mealNumber;
      break;
    case 'Monday':
      meal = 'Meal for Monday - Meal ' + mealNumber;
      break;
    default:
      meal = 'No meal found';
  }
  res.send(meal);
});


module.exports = router;
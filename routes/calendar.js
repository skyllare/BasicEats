var express = require('express');
const MealPlan = require('../models/MealPlan')
const User = require('../models/User');
const Recipe = require('../models/Recipe');

const { MY_API_KEY } = require('./config');
var router = express.Router();
const { Op } = require('sequelize');

let mealplan;
let mealsByDay;
let dayOfWeek = 'empty';
let selectedDay = {1:[],2:[],3:[]};
let currentDay = 'empty';

function getWeekDates() {
  const day = currentDay.getDay();
  const firstDayOfWeek = new Date(currentDay);
  firstDayOfWeek.setDate(currentDay.getDate() - day);

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

router.get('/', async function (req, res, next) {
  const user = req.session.user;

  // If user is not logged in, redirect to login page
  if (!user) {
    return res.redirect('/login');
  }

  if (req.query.msg) {
    res.locals.msg = req.query.msg
  }

  if (currentDay == 'empty') {
    currentDay = new Date();
  }
  const firstDay = currentDay.getDay(); // Get the current day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  let sunday = new Date(currentDay); // Create a new Date object with today's date
  sunday.setDate(currentDay.getDate() - firstDay); // Subtract the difference from today's date to get Sunday
  let saturday = new Date(sunday); // Create a copy of the Sunday date
  saturday.setDate(sunday.getDate() + 6);
  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
  const dayOfMonth = String(sunday.getDate()).padStart(2, '0');
  const formattedSunday = `${year}-${month}-${dayOfMonth}`;
  const saturdayYear = saturday.getFullYear();
  const saturdayMonth = String(saturday.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
  const saturdayDay = String(saturday.getDate()).padStart(2, '0');
  const formattedSaturday = `${saturdayYear}-${saturdayMonth}-${saturdayDay}`;
  console.log(formattedSunday)
  console.log(formattedSaturday)


  console.log("CURRENT")
  //console.log(formattedSunday)
  //console.log(req.session.user)
  try {
    const weekDates = getWeekDates();
    //console.log("weekdates:")
    //console.log(weekDates)
    mealplan = await MealPlan.findAll({
      where: {
        username: user.username,
        day: {[Op.between]: [formattedSunday, formattedSaturday]}
    
      }
    });

    //Meake mealsByDay array:
    mealsByDay = { 'Sunday': {}, 'Monday': {}, 'Tuesday': {}, 'Wednesday': {}, 'Thursday': {}, 'Friday': {}, 'Saturday': {} };
    for (day in mealsByDay) {
      mealsByDay[day] = {
        1: [],
        2: [],
        3: []
      };
    }
    console.log("DSKJSJ")
    
    if (dayOfWeek == 'empty') {
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      dayOfWeek = weekdays[currentDayOfWeek];
      console.log(dayOfWeek)
    }
    
    
    //console.log("mealplan:")
    //console.log(mealplan)

    mealplan.forEach(meal => {
      mealsByDay[meal.weekday][meal.mealNum].push(meal);
    })
    selectedDay = mealsByDay[dayOfWeek];
    console.log(selectedDay)
    //selectedDay = 
    //console.log("mealsbyDay:")

    //console.log(mealsByDay)

    //console.log(mealplan)
    res.render('calendar', { weekDates: weekDates, mealplan: mealplan, mealsByDay: mealsByDay, dayOfWeek: dayOfWeek, selectedDay: selectedDay }); // Pass mealplan to the template
  } catch (error) {
    console.error("Error fetching mealplan:", error);
    next(error); // Forward the error to the error handler
  }
});

router.post('/generate', async function(req, res, next) {
  console.log('THIS IS A TEST')
  //console.log(mealsByDay)
  const user = req.session.user;
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mealNumType = ['breakfast', '', 'main course']
  const dietPreference = req.body.dietPreference;
  const minCalories = req.body.minCalories;
  const maxCalories = req.body.maxCalories;
  const minProtein = req.body.minProtein;

  try {
    for (const weekday in weekDays) {
       const today = new Date();
       const currentDay = today.getDay();
       const sunday = new Date(today);
       sunday.setDate(today.getDate() - currentDay);
       sunday.setDate(sunday.getDate() + parseInt(weekday));
      
       for (let i = 1; i <= 3; i++) {

        const apiUrl = `https://api.spoonacular.com/recipes/random?apiKey=${MY_API_KEY}&tags=${dietPreference}&minCalories=${req.body.minCalories}&maxCalories=${req.body.maxCalories}&minProtein=${req.body.minProtein}&type=${mealNumType[i-1]}`;        
        const response = await fetch(apiUrl);
        console.log(response)
        const data = await response.json();
        console.log(data)
        const randomRecipe = data.recipes[0]; 

        const existingMeal = await MealPlan.findOne({
          where: {
            username: user.username,
            day: sunday,
            weekday: weekDays[weekday],
            mealNum: i
          }
        });
        if (existingMeal) {
          // If a meal exists, update its name with randomRecipe.title
          existingMeal.name = randomRecipe.title;
          await existingMeal.save();
          console.log('Existing meal updated:', existingMeal);
        } else {
          // If no meal exists, create a new meal object
          const newMeal = await MealPlan.create({
            username: user.username,
            day: sunday, // Adjust date format as needed
            weekday: weekDays[weekday],
            mealNum: i,
            name: randomRecipe.title,
            recipeid: randomRecipe.id
          });
          console.log('New meal created:', newMeal);
        }
        const existingRecipe = await Recipe.findOne({
          where: {
            recipeid: randomRecipe.id
          }
        });
        if (!existingMeal) {
          const newRecipe = await Recipe.create({
            recipeid: randomRecipe.id,
            username: 'placement',
            recipename: randomRecipe.name,
            ingredients: randomRecipe.ingredients,
            recipedesc: randomRecipe.description,
            instructions: randomRecipe.instructions,
            time: randomRecipe.time
          });
        } 
      }
    }

    res.redirect('/calendar')
    //res.render('calendar', {mealsByDay: mealsByDay})
  }catch (error) {
    console.log(error)
    console.log("meal plan could not be created");
    // res.redirect("/login");
    //res.locals.msg = "fail";
    res.redirect('/calendar')
    //res.render('calendar', {mealsByDay: mealsByDay})
    
  }  
  
  
});


router.post('/updateDay', (req, res) => {
  dayOfWeek = req.body.action;
  console.log("DAY")
  console.log(dayOfWeek)
  res.redirect('/calendar')
});


router.post('/previousWeek', (req, res) => {
  currentDay.setDate(currentDay.getDate() - 7);
  res.redirect('/calendar')
});

router.post('/nextWeek', (req, res) => {
  currentDay.setDate(currentDay.getDate() + 7);
  res.redirect('/calendar')
});



router.post('/newMeal/:mealId', async function(req, res, next) {
  console.log('THIS IS A TEST')
  //console.log(mealsByDay)
  const user = req.session.user;


  try {
       
        const apiUrl = `https://api.spoonacular.com/recipes/random?apiKey=${MY_API_KEY}`;        
        const response = await fetch(apiUrl);
        console.log(response)
        const data = await response.json();
        console.log(data)
        const randomRecipe = data.recipes[0]; 

        const existingMeal = await MealPlan.findOne({
          where: {
            username: user.username,
            weekday: req.res.day,
            mealNum: req.res.mealNum
          }
        });
        if (existingMeal) {
          // If a meal exists, update its name with randomRecipe.title
          existingMeal.name = randomRecipe.title;
          await existingMeal.save();
          console.log('Existing meal updated:', existingMeal);
        } else {
          // If no meal exists, create a new meal object
          const newMeal = await MealPlan.create({
            username: user.username,
            day: req.res.selectedDay, // Adjust date format as needed
            weekday: req.res.weekday,
            mealNum: req.res.mealNum,
            name: randomRecipe.title,
            recipeid: randomRecipe.id
          });
          console.log('New meal created:', newMeal);
        }
        const existingRecipe = await Recipe.findOne({
          where: {
            recipeid: randomRecipe.id
          }
        });
        if (!existingMeal) {
          const newRecipe = await Recipe.create({
            recipeid: randomRecipe.id,
            username: 'placement',
            recipename: randomRecipe.name,
            ingredients: randomRecipe.ingredients,
            recipedesc: randomRecipe.description,
            instructions: randomRecipe.instructions,
            time: randomRecipe.time
          });
        } 
      

    res.redirect('/calendar')
    //res.render('calendar', {mealsByDay: mealsByDay})
  }catch (error) {
    console.log(error)
    console.log("meal plan could not be created");
    // res.redirect("/login");
    //res.locals.msg = "fail";
    res.redirect('/calendar')
    //res.render('calendar', {mealsByDay: mealsByDay})
    
  }  
  
  
});


router.post('/deleteMeal/:mealId', async function(req, res, next) {
  

  try {
    await Meal.findByIdAndDelete(req.body.mealId);
    res.redirect('/calendar')
    //res.render('calendar', {mealsByDay: mealsByDay})
  } catch (error) {
    console.log(error)
    console.log("meal plan could not be created");
    // res.redirect("/login");
    //res.locals.msg = "fail";
    res.redirect('/calendar')
    //res.render('calendar', {mealsByDay: mealsByDay})
    
  }  
  
  
});









module.exports = router;
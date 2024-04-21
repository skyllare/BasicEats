var express = require('express');
const MealPlan = require('../models/MealPlan')
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Saved_Recipe = require('../models/Saved_Recipe');


const { MY_API_KEY } = require('./config');
var router = express.Router();
const { Op } = require('sequelize');

//Global variables:
let mealplan;
let mealsByDay;
let dayOfWeek = 'empty';
let selectedDay = {1:[],2:[],3:[]};
let currentDay = 'empty';

//Gets all dates for full 7 day week:
function getWeekDates() {
  const day = currentDay.getDay();
  const firstDayOfWeek = new Date(currentDay);
  firstDayOfWeek.setDate(currentDay.getDate() - day);

  const weekDates = [];
  const date = new Date(firstDayOfWeek);
  for (let i = 0; i < 7; i++) {
    // Formatting the date to display in 'YYYY-MM-DD' format
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    weekDates.push(formattedDate);
    //Get next day:
    date.setDate(date.getDate() + 1);
  }
  return weekDates;
}

//Renders the weekly meal plan "calendar.ejs" page:
router.get('/', async function (req, res, next) {
  const user = req.session.user;

  // If user is not logged in, redirect to login page
  if (!user) {
    return res.redirect('/login');
  }

  if (req.query.msg) {
    res.locals.msg = req.query.msg
    console.log(res.locals.msg)
  }

  //If no day is selected yet:
  if (currentDay == 'empty') {
    currentDay = new Date();
  }
  //Get the day of the week it currently is
  const firstDay = currentDay.getDay();
  let sunday = new Date(currentDay);
  //Get sunday of the current week
  sunday.setDate(currentDay.getDate() - firstDay);
  let saturday = new Date(sunday); // Create a copy of the Sunday date
  saturday.setDate(sunday.getDate() + 6);
  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(sunday.getDate()).padStart(2, '0');
  //Format to be able to query:
  const formattedSunday = `${year}-${month}-${dayOfMonth}`;
  //Get Saturday
  const saturdayYear = saturday.getFullYear();
  const saturdayMonth = String(saturday.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
  const saturdayDay = String(saturday.getDate()).padStart(2, '0');
  //Format Saturday:
  const formattedSaturday = `${saturdayYear}-${saturdayMonth}-${saturdayDay}`;
  console.log(formattedSunday)
  console.log(formattedSaturday)

  try {
    //Get dates of current week:
    const weekDates = getWeekDates();

    //Get mealplan for user for current week:
    mealplan = await MealPlan.findAll({
      where: {
        username: user.username,
        day: {[Op.between]: [formattedSunday, formattedSaturday]}
    
      }
    });

    //Meake mealsByDay array to send to ejs:
    mealsByDay = { 'Sunday': {}, 'Monday': {}, 'Tuesday': {}, 'Wednesday': {}, 'Thursday': {}, 'Friday': {}, 'Saturday': {} };
    for (day in mealsByDay) {
      mealsByDay[day] = {
        1: [],
        2: [],
        3: []
      };
    }
    //If no day of Week chosen, get current day:
    if (dayOfWeek == 'empty') {
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      dayOfWeek = weekdays[currentDayOfWeek];
      console.log(dayOfWeek)
    }

    //Sort mealplan to week:
    mealplan.forEach(meal => {
      mealsByDay[meal.weekday][meal.mealNum].push(meal);
    })
    selectedDay = mealsByDay[dayOfWeek];
    console.log(selectedDay)
    //Render the calendar:
    res.render('calendar', { msg: res.locals.msg, weekDates: weekDates, mealplan: mealplan, mealsByDay: mealsByDay, dayOfWeek: dayOfWeek, selectedDay: selectedDay }); 
    res.locals.msg = "empty";
  } catch (error) {
    console.error("Error fetching mealplan:", error);
    next(error); // Forward the error to the error handler
  }
});

//Generates a meal plan upon pressing button:
router.post('/generate', async function(req, res, next) {

  const user = req.session.user;
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mealNumType = ['breakfast', 'main+course', 'main+course']
  const dietPreference = req.body.dietPreference;


  try {
    for (const weekday in weekDays) {
      //Gets current day:
       const today = new Date();
       const currentDay = today.getDay();
       const sunday = new Date(today);
       sunday.setDate(today.getDate() - currentDay);
       sunday.setDate(sunday.getDate() + parseInt(weekday));
      
       //Generates for each day:
       for (let i = 1; i <= 3; i++) {
        //Get spoonacular recipe:
        const apiUrl = `https://api.spoonacular.com/recipes/random?apiKey=${MY_API_KEY}&tags=${dietPreference},${mealNumType[i-1]}&minCalories=${req.body.minCalories}&maxCalories=${req.body.maxCalories}&minProtein=${req.body.minProtein}&type=${mealNumType[i-1]}`;        
        const response = await fetch(apiUrl);
        console.log(response)
        const data = await response.json();
        console.log(data)
        const randomRecipe = data.recipes[0]; 
        //See if meal exists already:
        const existingMeal = await MealPlan.findOne({
          where: {
            username: user.username,
            day: sunday,
            weekday: weekDays[weekday],
            mealNum: i
          }
        });
        //Create meal if it does not exist:
        if (existingMeal) {
          existingMeal.name = randomRecipe.title;
          existingMeal.recipeid = randomRecipe.id;
          await existingMeal.save();
          console.log('Existing meal updated:', existingMeal);
        } 
        //If not meal exists, create a new meal
        else {
          const newMeal = await MealPlan.create({
            username: user.username,
            day: sunday,
            weekday: weekDays[weekday],
            mealNum: i,
            name: randomRecipe.title,
            recipeid: randomRecipe.id
          });
          console.log('New meal created:', newMeal);
        }
        
        // const existingRecipe = await Recipe.findOne({
        //   where: {
        //     recipeid: randomRecipe.id
        //   }
        // });
        // if (!existingMeal) {
        //   const newRecipe = await Recipe.create({
        //     recipeid: randomRecipe.id,
        //     username: 'placement',
        //     recipename: randomRecipe.title,
        //     //ingredients: randomRecipe.extendedIngredients,
        //     ingredients: 'placeholder',
        //     recipedesc: randomRecipe.summary,
        //     instructions: randomRecipe.instructions,
        //     time: randomRecipe.readyInMinutes
        //   });
        // } 
      }
    }
    res.locals.msg = "meals_created";
    res.redirect('/calendar')
  }catch (error) {
    console.log(error)
    console.log("meal plan could not be created");

    res.redirect('/calendar') 
  }  
});

//Gets the day selected:
router.post('/updateDay', (req, res) => {
  dayOfWeek = req.body.action;
  console.log("DAY")
  console.log(dayOfWeek)
  res.redirect('/calendar')
});

//Changes to previous week:
router.post('/previousWeek', (req, res) => {
  currentDay.setDate(currentDay.getDate() - 7);
  res.redirect('/calendar')
});

//Changes to next week:
router.post('/nextWeek', (req, res) => {
  currentDay.setDate(currentDay.getDate() + 7);
  res.redirect('/calendar')
});

//Makes a new meal:
router.post('/newMeal', async function(req, res, next) {
  console.log('THIS IS A TEST')
  const weekDates = getWeekDates();
  const user = req.session.user;
  console.log(req.body.mealType)
  let num = parseInt(req.body.mealType);
  console.log(selectedDay[num])
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let date;
console.log(selectedDay[num].length)
  try {
    //Get day:
       if (selectedDay[num].length < 1) {
        const dayIndex = weekDays.indexOf(dayOfWeek);
        console.log(dayIndex)
        date = weekDates[dayIndex];
      }
      else {
        date = selectedDay[num][0].day;
      }
      console.log(date)
      //Gets a new spoonacular recipe:
        const apiUrl = `https://api.spoonacular.com/recipes/random?apiKey=${MY_API_KEY}&type=main+course&tags=main+course`;        
        const response = await fetch(apiUrl);
        console.log(response)
        const data = await response.json();
        console.log(data)
        const randomRecipe = data.recipes[0]; 
        const existingMeal = await MealPlan.findOne({
          where: {
            username: user.username,
            day: date,
            mealNum: num
          }
        });
        if (existingMeal) {
          // If a meal exists, update its name with randomRecipe.title
          existingMeal.name = randomRecipe.title;
          existingMeal.recipeid = randomRecipe.id;
          existingMeal.weekday = dayOfWeek;
          await existingMeal.save();
          console.log('Existing meal updated:', existingMeal);
        } else {
          // If no meal exists, create a new meal object
          const newMeal = await MealPlan.create({
            username: user.username,
            day: date, // Adjust date format as needed
            weekday: dayOfWeek,
            mealNum: num,
            name: randomRecipe.title,
            recipeid: randomRecipe.id
          });
          console.log('New meal created:', newMeal);
        }
        // const existingRecipe = await Recipe.findOne({
        //   where: {
        //     recipeid: randomRecipe.id
        //   }
        // });
        // if (!existingMeal) {
        //   const newRecipe = await Recipe.create({
        //     recipeid: randomRecipe.id,
        //     username: 'placement',
        //     recipename: randomRecipe.title,
        //     //ingredients: randomRecipe.extendedIngredients,
        //     ingredients: 'placeholder',
        //     recipedesc: randomRecipe.summary,
        //     instructions: randomRecipe.instructions,
        //     time: randomRecipe.readyInMinutes
        //   });
        // } 
    res.redirect('/calendar')
  }catch (error) {
    console.log(error)
    console.log("meal plan could not be created");
    res.redirect('/calendar') 
  }  
});

//Deletes a meal:
router.post('/deleteMeal', async function(req, res, next) {
  const user = req.session.user;
  const weekDates = getWeekDates();
  //console.log(mealsByDay)
  let num = parseInt(req.body.mealType);
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  try {
    // Find the meal to delete
    let date;
    if (selectedDay[num].length > 0) {
      const dayIndex = weekDays.indexOf(dayOfWeek);
      console.log(dayIndex)
      date = weekDates[dayIndex];
      //Finds the meal:
      const mealToDelete = await MealPlan.findOne({
        where: { username: user.username, day: date, mealNum: num }
      });

      //Deletes the meal:
      if (mealToDelete) {
        await mealToDelete.destroy();
        console.log("meal deleted")
      }
    }
  res.redirect('/calendar')
  } catch (error) {
    console.log(error)
    console.log("meal could not be deleted");
    res.redirect('/calendar')   
  }  
});


router.post('/generateRecipes', async function(req, res, next) {

  const user = req.session.user;
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  

  try {
    const existingRecipe = await Recipe.findAll({
    where: {
      username: user.username
    }
  });
  console.log(existingRecipe)
  let random = existingRecipe.length;
  console.log("random")
  console.log(random)
  if (random > 0) {
    for (const weekday in weekDays) {
       const today = new Date();
       const currentDay = today.getDay();
       const sunday = new Date(today);
       sunday.setDate(today.getDate() - currentDay);
       sunday.setDate(sunday.getDate() + parseInt(weekday));
       for (let i = 1; i <= 3; i++) {

        let findRandom = Math.floor(Math.random() * random);
        console.log(findRandom)
        console.log(existingRecipe[findRandom])
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
          existingMeal.name = existingRecipe[findRandom].recipename;
          existingMeal.recipeid = existingRecipe[findRandom].recipeid;
          await existingMeal.save();
          console.log('Existing meal updated:', existingMeal);
        } else {
          // If no meal exists, create a new meal object
          const newMeal = await MealPlan.create({
            username: user.username,
            day: sunday, // Adjust date format as needed
            weekday: weekDays[weekday],
            mealNum: i,
            name: existingRecipe[findRandom].recipename,
            recipeid: existingRecipe[findRandom].recipeid
          });
          console.log('New meal created:', newMeal);
        }
      }
    }
    res.redirect('/calendar')
  }
  else {
    res.locals.msg = "no_recipes";
    res.redirect('/calendar?msg=${res.locals.msg}')
  }
    //res.render('calendar', {mealsByDay: mealsByDay})
  }catch (error) {
    console.log(error)
    console.log("meal plan could not be created");
    // res.redirect("/login");
    //res.locals.msg = "fail";
    res.redirect('/calendar')
  }  
});








module.exports = router;
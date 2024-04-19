const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')



class MealPlan extends Model {

    static async findMealPlan(username, day, mealNum, name){
        try {
            const mealplan = await MealPlan.findByPk(username, day, mealNum)
            return mealplan;
        } catch (error) {
            console.log(error)
            return null
        }
    }

}

MealPlan.init({
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  day: {
    type: DataTypes.DATEONLY,
    primaryKey: true,
    allowNull: false
  },
  weekday: {
    type: DataTypes.STRING,
    allowNull:false
  },
  mealNum: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recipeid: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  sequelize, 
  modelName: 'MealPlan',
  timestamps: false
});

module.exports = MealPlan
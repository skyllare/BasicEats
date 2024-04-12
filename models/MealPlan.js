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
    allowNull: false
  },
  weekday: {
    type: DataTypes.STRING,
    allowNull:false
  },
  mealNum: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, 
  modelName: 'MealPlan',
  timestamps: false
});

module.exports = MealPlan
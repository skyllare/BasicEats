const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Recipe extends Model {

    static async findRecipe(recipeid){
        try {
            const recipe = await Recipe.findByPk(recipeid)
            return recipe ? recipe : null;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

Recipe.init({
  recipeid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recipename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  recipedesc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  time: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize, 
  modelName: 'Recipe'
});

module.exports = Recipe
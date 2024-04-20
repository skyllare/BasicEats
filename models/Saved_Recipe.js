const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Saved_Recipe extends Model {

  static async findRecipe(recipeID, username) {
    try {
      const recipe = await Saved_Recipe.findOne({
        where: {
          recipeid: recipeID,
          username: username
        }
      });
  
      return recipe ? recipe : null;
    } catch (error) {
      console.error('Error finding recipe:', error);
      return null;
    }
  }
  

  static async getAllRecipes(username) {
    try {
      const recipes = await Saved_Recipe.findAll({
        where: { username: username }
      });
      return recipes;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

Saved_Recipe.init({
  recipeid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  recipename: {
    type: DataTypes.STRING,
    allowNull: true
  }

}, {
  sequelize,
  modelName: 'Saved_Recipe'
});

module.exports = Saved_Recipe
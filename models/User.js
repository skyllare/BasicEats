const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class User extends Model {

    static async findUser(username, password){
        try {
            const user = await User.findByPk(username)
            if(user && user.password === password){
                return user
            }else{
                return null
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }

}

User.init({
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  admin :{
    type: Boolean,
    allowNull: false,
    defaultValue: false,
  },
  recipe_count :{
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }

}, {
  sequelize, 
  modelName: 'User',
  timestamps: false
});

module.exports = User
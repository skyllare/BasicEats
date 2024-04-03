const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/hw2db.sqlite'
})

module.exports = sequelize
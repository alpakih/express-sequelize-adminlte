'use strict'
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    active: DataTypes.BOOLEAN,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    underscored: true
  })
  users.associate = function (models) {
    users.belongsTo(models.roles)
  }
  return users
}

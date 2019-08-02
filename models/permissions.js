'use strict'
module.exports = (sequelize, DataTypes) => {
  const permissions = sequelize.define('permissions', {
    label: DataTypes.STRING,
    value: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    }

  }, {
    underscored: true
  })
  permissions.associate = function (models) {
  // permissions.hasMany(models.roles)
  }
  return permissions
}

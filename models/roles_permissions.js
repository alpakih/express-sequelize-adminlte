'use strict'
module.exports = (sequelize, DataTypes) => {
  const rolesPermissions = sequelize.define('roles_permissions', {
    role_id: DataTypes.STRING,
    permission_id: DataTypes.STRING
  }, {})
  rolesPermissions.associate = function (models) {
    models.roles.belongsToMany(models.permissions, { through: rolesPermissions })
    models.permissions.belongsToMany(models.roles, { through: rolesPermissions })
  }
  return rolesPermissions
}

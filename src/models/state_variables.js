'use strict';
module.exports = (sequelize, DataTypes) => {
  const StateVariables = sequelize.define('StateVariables', {
    property: DataTypes.STRING,
    value: DataTypes.STRING
  }, {});
  StateVariables.associate = function(models) {
  };
  return StateVariables;
};
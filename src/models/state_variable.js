'use strict';
module.exports = (sequelize, DataTypes) => {
  const StateVariable = sequelize.define('StateVariable', {
    property: {
      allowNull: false,
      unique: true,
      primaryKey: true,
      type: DataTypes.STRING
    },
    value: DataTypes.STRING
  }, {});
  StateVariable.associate = function (models) {
  };
  return StateVariable;
};
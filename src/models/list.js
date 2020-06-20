'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    filters: {
      type: DataTypes.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue('filters'));
      },
      set: function (value) {
        return this.setDataValue('filters', JSON.stringify(value));
      }
    }
  }, {});
  List.associate = function (models) {
  };
  return List;
};
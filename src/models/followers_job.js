'use strict';
module.exports = (sequelize, DataTypes) => {
  const FollowersJob = sequelize.define('FollowersJob', {
    cursor: DataTypes.STRING,
    status: DataTypes.INTEGER,
    scheduled: DataTypes.DATE,
    ran_at: DataTypes.DATE
  }, {});
  FollowersJob.associate = function (models) {
    // associations can be defined here
  };
  return FollowersJob;
};
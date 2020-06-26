'use strict';
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    name: DataTypes.STRING,
    message: DataTypes.STRING,
    description: DataTypes.STRING,
    allocated_msg_count: DataTypes.INTEGER,
    scheduled_time: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    last_run: DataTypes.DATE
  }, {});
  Campaign.associate = function (models) {
    Campaign.belongsToMany(models.User, { through: 'CampaignUsers', foreignKey: 'campaign_id', otherKey: 'user_id' });
    Campaign.hasMany(models.CampaignUser, { foreignKey: 'campaign_id' });
  };
  return Campaign;
};
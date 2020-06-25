'use strict';
import { JOB_STATUS } from '../constants'
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    name: DataTypes.STRING,
    message: DataTypes.STRING,
    weight: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  Campaign.associate = function (models) {
    // Campaign.belongsToMany(models.User, { through: 'CampaignUsers', foreignKey: 'campaign_id', otherKey: 'user_id' });
    Campaign.hasMany(models.CampaignUser, { foreignKey: 'campaign_id' });
    Campaign.hasMany(models.CampaignJob, { foreignKey: 'campaign_id' });
  };
  Campaign.getActiveJob = function () {
    return Campaign.getCampaignJobs({ where: { status: JOB_STATUS.SCHEDULED} })[0]
  }
  return Campaign;
};
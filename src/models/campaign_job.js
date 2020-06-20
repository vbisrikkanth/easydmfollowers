'use strict';
module.exports = (sequelize, DataTypes) => {
  const CampaignJob = sequelize.define('CampaignJob', {
    campaign_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    scheduled: DataTypes.DATE,
    ran_at: DataTypes.DATE
  }, {});
  CampaignJob.associate = function (models) {
    CampaignJob.belongsTo(models.Campaign, { foreignKey: 'campaign_id' })
    // CampaignJob.hasMany(models.CampaignUser, { foreignKey: 'job_id' })
  };
  return CampaignJob;
};
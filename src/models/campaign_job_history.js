'use strict';
module.exports = (sequelize, DataTypes) => {
  const CampaignJob = sequelize.define('CampaignJobHistory', {
    campaign_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    ran_at: DataTypes.DATE
  }, {});
  CampaignJob.associate = function (models) {
    
  };
  return CampaignJob;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const CampaignJobHistory = sequelize.define('CampaignJobHistory', {
    campaign_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    ran_at: DataTypes.DATE
  }, {});
  CampaignJobHistory.associate = function (models) {
    
  };
  return CampaignJobHistory;
};
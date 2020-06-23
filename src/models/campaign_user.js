'use strict';
module.exports = (sequelize, DataTypes) => {
  const CampaignUser = sequelize.define('CampaignUser', {
    user_id: DataTypes.STRING,
    campaign_id: DataTypes.INTEGER,
    job_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  CampaignUser.associate = function (models) {
    // CampaignUser.belongsTo(models.CampaignJob, { foreignKey: 'job_id' });
    CampaignUser.belongsTo(models.User, { foreignKey: 'user_id', otherKey: 'id_str' })
  };
  return CampaignUser;
};
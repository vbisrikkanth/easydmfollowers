'use strict';
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    name: DataTypes.STRING,
    message: DataTypes.TEXT,
    description: DataTypes.STRING,
    allocated_msg_count: DataTypes.INTEGER,
    scheduled_time: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    last_run: DataTypes.DATE,
    metadata: {
      type: DataTypes.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue('metadata'));
      },
      set: function (value) {
        return this.setDataValue('metadata', JSON.stringify(value));
      }
    }
  }, {});
  Campaign.associate = function (models) {
    Campaign.belongsToMany(models.User, { through: 'CampaignUsers', foreignKey: 'campaign_id', otherKey: 'user_id' });
    Campaign.hasMany(models.CampaignUser, { foreignKey: 'campaign_id', onDelete: 'CASCADE' });
  };
  return Campaign;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id_str: {
      allowNull: false,
      unique: true,
      primaryKey: true,
      type: DataTypes.STRING
    },
    name: DataTypes.STRING,
    screen_name: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.STRING,
    protected: DataTypes.BOOLEAN,
    verified: DataTypes.BOOLEAN,
    followers_count: DataTypes.INTEGER,
    friends_count: DataTypes.INTEGER,
    listed_count: DataTypes.INTEGER,
    favourites_count: DataTypes.INTEGER,
    statuses_count: DataTypes.INTEGER,
    default_profile: DataTypes.BOOLEAN,
    default_profile_image: DataTypes.BOOLEAN
  }, {});
  User.associate = function (models) {
    // User.belongsToMany(models.Campaign, { through: 'CampaignUsers', foreignKey: 'user_id', otherKey: 'campaign_id' });
  };
  return User;
};
const { Sequelize,DataTypes  } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: console.log
});

const User = sequelize.define('User', {
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  id_str: {
    type: DataTypes.STRING,
    allowNull: false
  },
  screen_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING
  },
  followers_count:{
    type: DataTypes.INTEGER
  },
  friends_count:{
    type: DataTypes.INTEGER
  },
  statuses_count:{
    type: DataTypes.INTEGER
  },
  verified:{
    type: DataTypes.BOOLEAN
  }
}, {
  // Other model options go here
});

const SyncStatus = sequelize.define('SyncStatus', {
  status: {
    type: DataTypes.STRING
  },
  cursor_str: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.STRING
  }
});

User.hasMany(SyncStatus);
SyncStatus.belongsTo(User);
User.belongsToMany(User,{as:'Follower',through:'Followers'});

async function insertUsersInDB(followers,cursor_str){
    const currentUser = await getCurrentUser();
    const followersInDB = await User.bulkCreate(followers,{ updateOnDuplicate: ["screen_name", "location","followers_count","friends_count","statuses_count","verified"] })
    currentUser.addFollower(followersInDB);

   //Also update the status of the sync status table
    const status = await currentUser.getSyncStatuses({
        where:{
            type:"FL"
        }
    });
    if(cursor_str === "0"){
        status[0].status ="D";
    } 
    status[0].cursor_str =cursor_str;
    status[0].save();
}



//Debug function to print the followers and the sync status
async function getFollowers(){
    const currentUser = await User.findOne(
        {
            where:{
                id:1
            }
        }
    )
    const followers = await currentUser.getFollower({
        order:sequelize.literal('followers_count DESC')
    });
    console.log(followers.length);
    console.log("Followers:", JSON.stringify(followers[0],null,2));
    const status = await currentUser.getSyncStatuses({
        where:{
            type:"FL"
        }
    });
    console.log("Sync Status of Follow List:", JSON.stringify(status[0],null,2));
}


//Get the me user. Not sure if there's an API - so creating userID 1 for time being
async function getCurrentUser(){
    const currentUser = await User.findOne({
        where:{
            id:1
        }
    });
    return currentUser;
}

//Inser Current User as 1. Not sure if there's an API - so creating userID 1 for time being
async function createTwitterUser(){
    await sequelize.sync({force:true});
    const currentUser = await User.create({
        id:1,
        id_str:"1",
        screen_name:"Current User"
    });
    const syncStatus = await SyncStatus.create({
         status:"P",
         type:"FL",
         cursor_str:"-1"
     });
    currentUser.addSyncStatus(syncStatus);
}

//createTwitterUser();
//getFollowers();

exports.getCurrentUser = getCurrentUser;
exports.insertUsersInDB = insertUsersInDB;

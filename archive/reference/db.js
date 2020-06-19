const db = require('./models');
const { Users } = db;
async function insertUsersInDB(followers,cursor_str){
    const currentUser = await getCurrentUser();
    const followersInDB = await Users.bulkCreate(followers,{ updateOnDuplicate: ["screen_name", "location","followers_count","friends_count","statuses_count","verified","protected","description", "listed_count","favourites_count","statuses_count","default_profile","default_profile_image"] })
    currentUser.addFollower(followersInDB);

   //Also update the status of the sync status table
    const status = await currentUser.getSyncStatuses({
        where:{
            type:"FL" // Indicates the type of the sync as FL => Follow List
        }
    });
    if(cursor_str === "0"){
        status[0].status ="D"; // Mark this as done
    } 
    status[0].cursor_str =cursor_str;
    status[0].save();
}



//Debug function to print the followers and the sync status
async function getFollowers(){
    const currentUser = await Users.findOne(
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
    const currentUser = await Users.findOne({
        where:{
            id:1
        }
    });
    return currentUser;
}

//Inser Current Users as 1. Not sure if there's an API - so creating userID 1 for time being
async function createTwitterUser(){
    await sequelize.sync({force:true});
    const currentUser = await Users.create({
        id:1,
        id_str:"1",
        screen_name:"Current Users"
    });
    const syncStatus = await SyncStatus.create({
         status:"P",  // Mark this as in Progress
         type:"FL",
         cursor_str:"-1"
     });
    currentUser.addSyncStatus(syncStatus);
}

createTwitterUser();
//getFollowers();

exports.getCurrentUser = getCurrentUser;
exports.insertUsersInDB = insertUsersInDB;

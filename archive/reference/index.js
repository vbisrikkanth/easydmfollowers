const Twitter =  require("twitter-lite")
const db = require("./db")

const client = new Twitter({
  subdomain: "api", // "api" is the default (change for other subdomains)
  version: "1.1", // version "1.1" is the default (change for other subdomains)
  consumer_key: "<Consumer Key>", // from Twitter.
  consumer_secret: "<Consumer Secret Key>", // from Twitter.
  access_token_key: "<Token>", // from your User (oauth_token)
  access_token_secret: "<Token Secret>" // from your User (oauth_token_secret)
});

async function getFollowers(nextCursor){
    try{
        const followers = await client.get("followers/list",{
            cursor:nextCursor
        });
        const next_cursor_str = followers.next_cursor_str;
        console.log(`Next Cursor Response: ${next_cursor_str}`);
        //console.log(followers.users);
        db.insertUsersInDB(followers.users,next_cursor_str);
        if(next_cursor_str && next_cursor_str !== "0"){
            const delta = (followers._headers.get('x-rate-limit-reset') * 1000) - Date.now()
            console.log(`Reset: ${Math.ceil(delta / 1000 / 60)} minutes`);
            //When the rate limit remaining is 0
            if(followers._headers.get('x-rate-limit-remaining') !== 0){
                getFollowers(next_cursor_str);
            }else{
                console.log(`We're going to wait for sometime here ${delta} ms`);
                setTimeout(()=>{
                    getFollowers(next_cursor_str);
                },delta);
            }
        }
   }
   catch(e){
        if (e.errors[0].code === 88){
            const delta = (e._headers.get('x-rate-limit-reset') * 1000) - Date.now();
            console.log(`We're going to wait for sometime here ${delta} ms`);
            setTimeout(()=>{
               getFollowers(nextCursor);
           },delta);
        }
    }
}

async function getAllFollowers(){
 
    const user = await db.getCurrentUser();
    //console.log(user);
    const status = await user.getSyncStatuses({
        where:{
            type:"FL"
        }
    });
    console.log("All users:", JSON.stringify(status,null,2));
    if(status[0].cursor_str ==="0"){
        console.log("We're done here");
    }else{
        console.log(`Resuming from ${status[0].cursor_str}`);
         await getFollowers(status[0].cursor_str);
    }
}

getAllFollowers();

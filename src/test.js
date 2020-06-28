require('dotenv').config()
import EasyDMCore from './index'

const easyDMCore = new EasyDMCore("jupiter.sqlite");

async function test3() {
    let userObject = await easyDMCore.getUserObject();
    console.log(userObject);
    if (userObject.error) {
        userObject = await easyDMCore.setKeys({
            consumer_key: process.env.consumer_key,
            consumer_secret: process.env.consumer_secret,
            access_token_key: process.env.access_token_key,
            access_token_secret: process.env.access_token_secret
        });
    }
};
test3();
// 1 users
const filter1 = {
    filterType: "AND",
    conditions: [
        {
            id: "followers_count",
            operator: "GT",
            value: 3000
        },
        {
            id: "friends_count",
            operator: "LT",
            value: 10
        }
    ]
}

// 2 user
const filter2 = {
    filterType: "AND",
    conditions: [
        {
            id: "followers_count",
            operator: "GT",
            value: 3000
        },
        {
            id: "friends_count",
            operator: "LT",
            value: 400
        }
    ]
}
async function test5() {
    const res = await easyDMCore.getPaginatedFollowers({
        limit: 100, offset: 0, order: [
            // ["followers_count", "ASC"],
            ["friends_count", "DESC"]
        ],
        segmentIds:[1,2]
    });
    console.log(res);

}
async function test4() {
    const newSegment = {
        name: "Segment 2",
        description: "This is a test Segment",
        filters:filter2
    }
    //const createdSegment = await easyDMCore.createSegment(newSegment);
    //console.log(await easyDMCore.getSegment(createdSegment.id));
    console.log(await easyDMCore.createSegment(newSegment));
}

// test4();


async function test8() {
    console.log((await easyDMCore.createCampaign({
        name: "Campaign 1",
        message: "Hi [user_name], Check out the link",
        allocated_msg_count: 500,
        description: "For segment 1 and 2",
        scheduled_time: 834,
        segmentIds:[]
    })));
}
// test8();
async function test9() {
    // console.log(await easyDMCore.getAllCampaigns())
    console.log(await easyDMCore.updateCampaign(1,{status: 50}))
    // console.log((await easyDMCore.getCampaignUserPaginated({ id: 6})).count);
}
test9();
async function test10() {
    console.log(await easyDMCore.getFollowersCount(), "Count");
}

async function test11() {
    let userObject = await easyDMCore.getUserObject();
    if (!userObject) {
        userObject = await easyDMCore.setKeys({
            consumer_key: process.env.consumer_key,
            consumer_secret: process.env.consumer_secret,
            access_token_key: process.env.access_token_key,
            access_token_secret: process.env.access_token_secret
        });

        if (userObject) {
            const recipients = "Srikkanth18,kggopal12,np_hinata";
            const text = "https://valq.com\nHello [user_name]! \n- from Hell Paradise";
            console.log( await easyDMCore.sendDM({ recipients, text }) );
        } else {
            console.log("Key authentication failed")
        }
    }
    else {
        const recipients = "Srikkanth18,kggopal12,np_hinata";
        const text = "https://valq.com\nHello [user_name]! \n- from Hell Paradise";
        console.log( await easyDMCore.sendDM({ recipients, text }) );
    }
}

// async function test12() {
//     // console.log(await easyDMCore.deleteCampaign(5));
//     console.log(await easyDMCore.reset());
// }

// test12();
// test12();
// test3();
// test9();
// test7();
// test4();
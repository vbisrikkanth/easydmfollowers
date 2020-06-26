import EasyDMCore from './index'


const easyDMCore = new EasyDMCore("jupiter.sqlite");

async function test3() {
    let userObject = await easyDMCore.getUserObject();
    if (!userObject) {
        userObject = await easyDMCore.setKeys({
        });

        if (userObject) {
            easyDMCore.syncFollowers(true);
        } else {
            console.log("Key authentication failed")
        }
    }
    else {
        easyDMCore.syncFollowers(true);
    }
};

async function test5() {
    const res = await easyDMCore.getPaginatedFollowers({
        limit: 100, offset: 0, order: [
            ["followers_count", "ASC"],
            ["friends_count", "DESC"]
        ]
    });
    console.log(res.length);

}
async function test4() {
    const newSegment = {
        name: "Segment2",
        description: "This is a test Segment",
        filters: {
            filterType: "AND",
            conditions: [
                {
                    id: "followers_count",
                    operator: "GT",
                    value: 5000
                }
            ]
        }
    }
    //const createdSegment = await easyDMCore.createSegment(newSegment);
    //console.log(await easyDMCore.getSegment(createdSegment.id));
    console.log(await easyDMCore.createSegment(newSegment));
}


//13,20
async function test7() {
    console.log((await easyDMCore.getPaginatedFollowers({
        segmentId: 21,
        order: [["friends_count", "DESC"]]
    })).length);
}

async function test8() {
    console.log((await easyDMCore.createCampaign({
        name: "Campaign 1",
        message: "Hi [user_name], Check out the link",
        allocated_msg_count: 500,
        description: "For segment 13 and 20",
        scheduled_time: 870,
        segmentIds: [13, 20]
    })));
}

async function test9() {
    // console.log((await easyDMCore.getCampaignUserPaginated({ id: 8, limit: 10 })));
    console.log(await easyDMCore.getAllActiveCampaign())
}

test9();
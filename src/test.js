import EasyDMCore from './index'


const easyDMCore = new EasyDMCore("jupiter.sqlite");

async function test3() {
    let userObject = await easyDMCore.getUserObject();
    if (!userObject) {
        userObject = await easyDMCore.setKeys({
            consumer_key: "d9NU6wtENpB7il52fi1B1QmEY",
            consumer_secret: "DOEbDkSMKapZSy9VaY5f11dtMiASxaIAKurSRG4eaj2V4VK5ve",
            access_token_key: "3075255631-HhDNzE0SioFxb8dy0kapEvs8rhFMUp4I0ARgDf8",
            access_token_secret: "4p19sW9uzJo04xu32QdWXZMwG2WGMJZavv37qzcqPtMvs"
        });

        if(userObject) {
             easyDMCore.syncFollowers(true);
        }else{
            console.log("Key authentication failed")
        }
    }
    else{
        easyDMCore.syncFollowers(true);
    }
};


async function test4() {
    const newSegment = {
        name: "Segment1",
        description: "This is a test Segment",
        filters: {
            where: {
                followers_count:{
                    gt : 100
                }
            },
            limit: 100
        }
    }

    //const createdSegment = await easyDMCore.createSegment(newSegment);
    //console.log(await easyDMCore.getSegment(createdSegment.id));
    console.log(await easyDMCore.getSegments());
}

async function test5(){
    console.log(await easyDMCore.getFollowersCount(),"Count");
}
// test5();
test3();
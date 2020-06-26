import EasyDMCore from './index'


const easyDMCore = new EasyDMCore("jupiter.sqlite");

async function test3() {
    let userObject = await easyDMCore.getUserObject();
    if (!userObject) {
        userObject = await easyDMCore.setKeys({
            consumer_key: "",
            consumer_secret: "",
            access_token_key: "",
            access_token_secret: ""
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


async function test4() {
    const newSegment = {
        name: "Segment1",
        description: "This is a test Segment",
        filters: {
            where: {
                followers_count: {
                    gt: 100
                }
            },
            limit: 100
        }
    }

    //const createdSegment = await easyDMCore.createSegment(newSegment);
    //console.log(await easyDMCore.getSegment(createdSegment.id));
    console.log(await easyDMCore.getSegments());
}

async function test5() {
    console.log(await easyDMCore.getFollowersCount(), "Count");
}

async function test6() {
    let userObject = await easyDMCore.getUserObject();
    if (!userObject) {
        userObject = await easyDMCore.setKeys({
            consumer_key: "",
            consumer_secret: "",
            access_token_key: "",
            access_token_secret: ""
        });

        if (userObject) {
            const users = await easyDMCore.getFollowers();

            await users.forEach(async (user) => {
                const recipient = user.screen_name;
                const text = "https://valq.com\nHello [user_name]! \n- from Hell Paradise";
                await easyDMCore.sendDM({ recipient, text });
            });
        } else {
            console.log("Key authentication failed")
        }
    }
    else {
        const users = await easyDMCore.getFollowers();

        await users.forEach(async (user) => {
            const recipient = user.screen_name;
            const text = "https://valq.com\nHello [user_name]! \n- from Hell Paradise";
            await easyDMCore.sendDM({ recipient, text });
        });
    }
}
// test5();
//test3();
test6();
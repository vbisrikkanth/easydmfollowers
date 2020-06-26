import { initDB } from './models'
import TwitterAdapter from './services/twitter_adapter';
import CampaignAdapter from './services/campaign_adapter';;
import { findAllUsers, findUsersCount, findUser } from './services/user';
import { createList, updateList, getAllLists, getList } from './services/list';

class EasyDMCore {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.db = initDB(connectionString);
        this.twitterAdapter = new TwitterAdapter();
        this.TwitterAdapter = TwitterAdapter;
        this.campaignAdapter = new CampaignAdapter(this.twitterAdapter);
    }

    //---- Followers ---- //

    async getPaginatedFollowers({ where, order, limit, offset }) {
        return (await findAllPaginatedUser({ where, order, limit, offset })).map(user => user.toJSON());
    }

    async getFollowers(where = {}) {
        return (await findAllUsers(where)).map(user => user.toJSON());
    }

    async getFollowersCount(where = {}) {
        return await findUsersCount(where)
    }

    async getUserObject() {
        return await this.twitterAdapter.getUserObject();
    }

    async syncFollowers(force) {
        this.twitterAdapter.syncFollowers(force);
    }

    async setKeys(twitterKey) {
        return await this.twitterAdapter.verifyAndSetTwitterKeys(twitterKey);
    }

    //---- Segments ---- //

    async createSegment({ name, description, filters }) {
        return (await createList({ name, description, filters }));
    }

    async updateSegment({ id, properties }) {
        return (await updateList(id, properties));
    }

    async getSegments() {
        return (await getAllLists());
    }

    async getSegment(id) {
        return (await getList(id));
    }
    
    //---- DM ---- //

    async sendDM({recipient,text}) {
        const where = { screen_name: recipient };
        const user = await findUser(where);
        return (await this.twitterAdapter.sendDM({user,text}));
    }

    static publicMethods = ["getPaginatedFollowers", "getFollowers", "getFollowersCount", "getUserObject", "syncFollowers", "setKeys", "createSegment",
        "updateSegment", "getSegments", "getSegment", "sendDM"]


}

export default EasyDMCore;

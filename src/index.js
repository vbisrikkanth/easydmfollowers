import { initDB } from './models'
import TwitterAdapter from './services/twitter_adapter';
import CampaignAdapter from './services/campaign_adapter';
import { createCampaign , getCampaignUserPaginated} from './services/campaign';
import { findAllUsers, findUsersCount, findAllPaginatedUsers } from './services/user';
import { createList, updateList, getAllLists, getList } from './services/list';
import campaign_user from './models/campaign_user';

class EasyDMCore {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.db = initDB(connectionString);
        this.twitterAdapter = new TwitterAdapter();
        this.TwitterAdapter = TwitterAdapter;
        this.campaignAdapter = new CampaignAdapter(this.twitterAdapter);
    }

    //---- Followers ---- //

    async getPaginatedFollowers(params) {
        return (await findAllPaginatedUsers(params)).map(user => user.toJSON());
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
        return (await createList({ name, description, filters })).toJSON();
    }

    async updateSegment({ id, properties }) {
        return (await updateList(id, properties)).toJSON();
    }

    async getSegments() {
        return (await getAllLists()).map(list => list.toJSON())
    }

    async getSegment(id) {
        return (await getList(id)).toJSON();
    }

    async createCampaign(params) {
        return (await createCampaign(params)).toJSON();
    }

    async getCampaignUserPaginated(params){
        return (await getCampaignUserPaginated(params)).map((campaignUser => {
            campaignUser = campaignUser.toJSON();
            const user = campaignUser.User;
            delete campaignUser.User
            return {
                ...user,
                ...campaignUser
            }
        }));
    }
    static publicMethods = ["getPaginatedFollowers", "getFollowers", "getFollowersCount", "getUserObject", "syncFollowers", "setKeys", "createSegment",
        "updateSegment", "getSegments", "getSegment"]

}

export default EasyDMCore;

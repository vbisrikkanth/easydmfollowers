import { initDB } from './models'
import TwitterAdapter from './services/twitter_adapter';
import CampaignAdapter from './services/campaign_adapter';
import { getCampaignUserPaginated, getAllActiveCampaign } from './services/campaign';
import { findAllUsers, findUsersCount, findAllPaginatedUsers, findUser } from './services/user';
import { createList, updateList, getAllLists, getList, deleteList } from './services/list';

class EasyDMCore {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.db = initDB(connectionString);
        this.twitterAdapter = new TwitterAdapter();
        this.TwitterAdapter = TwitterAdapter;
        this.campaignAdapter = new CampaignAdapter(this.twitterAdapter);
    }

    // --- Twitter Adapter --- //
    async getUserObject() {
        return await this.twitterAdapter.getUserObject();
    }

    async syncFollowers(force) {
        this.twitterAdapter.syncFollowers(force);
    }

    async setKeys(twitterKey) {
        return await this.twitterAdapter.verifyAndSetTwitterKeys(twitterKey);
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

    async deleteSegment(id) {
        return (await deleteList(id)).toJSON();
    }
    //---- DM ---- //

    async sendDM({ recipient, text }) {
        const where = { screen_name: recipient };
        const user = await findUser(where);
        return (await this.twitterAdapter.sendDM({ user, text }));
    }

    // --- Campaign ---//
    async createCampaign(params) {
        return (await this.campaignAdapter.createCampaign(params)).toJSON();
    }

    async updateCampaign(id, properties) {
        return (await this.campaignAdapter.updateCampaign(id, properties)).toJSON();
    }

    async deleteCampaign(id) {
        return (await this.campaignAdapter.deleteCampaign(id)).toJSON();
    }

    async getAllActiveCampaign() {
        return (await getAllActiveCampaign()).map(campaign => campaign.toJSON());
    }

    async getCampaignUserPaginated(params) {
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
    async getAllMissedCampaigns() {
        const { missedCampaigns } = await this.campaignAdapter.getAllMissedCampaigns();
        return missedCampaigns.map(campaign => campaign.toJSON());
    }
}

export default EasyDMCore;

import { initDB } from './models'
import TwitterAdapter from './services/twitter_adapter';
import CampaignAdapter from './services/campaign_adapter';;
import { findAllPaginatedUser } from './services/user';
class EasyDMCore {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.db = initDB(connectionString);
        this.twitterAdapter = new TwitterAdapter();
        this.TwitterAdapter = TwitterAdapter;
        this.campaignAdapter = new CampaignAdapter(this.twitterAdapter);
    }
    async getUsersPaginated({where, order, limit, offset}){
        return (await findAllPaginatedUser({where, order, limit, offset})).map(user => user.toJSON());
    }
}

export default EasyDMCore;

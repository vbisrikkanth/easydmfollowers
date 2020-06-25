import { initDB } from './models'
import TwitterAdapter from './services/twitter_adapter';
import CampaignAdapter from './services/campaign_adapter';;
import { findAllUsers } from './services/user';
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
    
    async getPaginatedFollowers({where, order, limit, offset}){
        return (await findAllPaginatedUser({where, order, limit, offset})).map(user => user.toJSON());
    }

    async getFollowers(where){
       return (await findAllUsers(where)).map(user => user.toJSON());
    }

    //---- Segments ---- //

    async createSegment({name, description, filters}){
        return (await createList({name, description, filters}));
    }

    async updateSegment({id, properties}){
        return (await updateList(id, properties));
    }

    async getSegments(){
        return (await getAllLists());
    }

    async getSegment(id){
        return (await getList(id));
    }

}

export default EasyDMCore;

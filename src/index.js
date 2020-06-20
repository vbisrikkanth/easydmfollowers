import { initDB } from './models'
import TwitterAdapter from './services/twitter_adapter';
class EasyDMCore {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.db = initDB(connectionString);
        this.twitterAdapter = new TwitterAdapter();
        this.TwitterAdapter = TwitterAdapter;
    }
}

export default EasyDMCore;
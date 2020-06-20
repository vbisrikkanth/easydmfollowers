import db from '../models';
import { CAMPAIGN_STATUS } from '../constants';

const add = async ({ name, message, weight, description }) => {
    const result = await db.Campaign.create({
        name,
        message,
        weight,
        description,
        status: CAMPAIGN_STATUS.NOT_STARTED
    });
    return result.toJSON();
}

const get = async (id) => {
    const camp = await db.Campaign.findByPk(id);
    const campUsers = camp.getCampaignUsers();
}
const update = async (id, properties) => {
    const result = await db.Campaign.update(properties, { where: { id } });
    return result.toJSON();
}

const getAll = async () => {
    const results = await db.Campaign.findAll();
    return results.map(item => item.toJSON());
}


export default { add, getAll, update };
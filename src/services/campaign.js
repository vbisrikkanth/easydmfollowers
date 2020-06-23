import db from '../models';
import { CAMPAIGN_STATUS, MAX_QUERY_LIMIT,  } from '../constants';
import { findAllPaginated } from './user';
export const getCampaign = async (id) => {
    return await db.Campaign.findByPk(id);
}
export const update = async (id, properties) => {
    const result = await db.Campaign.update(properties, { where: { id } });
    return result.toJSON();
}
export const destroy = async (id) => {
    const campaign = await db.Campaign.findByPk(id);
    return await campaign.destroy();
}

export const getAllActiveCampaign = async () => {
    return await db.Campaign.findAll({ where : CAMPAIGN_STATUS.RUNNING });
}

export const createCampaign = async ({ name, message, weight, description, segmentIds, sort }) => {
    const campaign = await db.Campaign.create({
        name,
        message,
        weight,
        description,
        status: CAMPAIGN_STATUS.NOT_STARTED
    });
    // 
    // const filter = segmentIds.filter OR
    let offset = 0, limit = MAX_QUERY_LIMIT;
    let users;
    do {
        users = await findAllPaginated({ offset, limit, where: filter, order: sort });
        await campaign.addUsers(users);
    } while (users.length >= limit);
    users = null;
    return campaign.get("id");
}

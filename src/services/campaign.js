import Op from 'sequelize/lib/operators';
import db from '../models';
import { CAMPAIGN_STATUS, MAX_QUERY_LIMIT, } from '../constants';
import { findAllPaginated } from './user';

export const getCampaign = async (id) => {
    return await db.Campaign.findByPk(id);
}
export const updateCampaign = async (id, properties) => {
    return await db.Campaign.update(properties, { where: { id } });
}
export const deleteCampaign = async (id) => {
    const campaign = await db.Campaign.findByPk(id);
    return await campaign.destroy();
}

export const getAllActiveCampaign = async () => {
    return await db.Campaign.findAll({ where: CAMPAIGN_STATUS.RUNNING });
}

export const createCampaign = async ({ name, message, allocated_msg_count, description, filters, sort }) => {
    const campaign = await db.Campaign.create({
        name,
        message,
        allocated_msg_count,
        description,
        status: CAMPAIGN_STATUS.RUNNING
    });
    const where = {
        [Op.or]: filters
    }
    let offset = 0, limit = MAX_QUERY_LIMIT;
    let users;
    do {
        users = await findAllPaginated({ offset, limit, where, order: sort });
        await campaign.addUsers(users);
    } while (users.length >= limit);
    users = null;
    return campaign;
}

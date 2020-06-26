import Op from 'sequelize/lib/operators';
import db from '../models';
import { getListFilters } from './list';
import { CAMPAIGN_STATUS, MAX_QUERY_LIMIT_RAW, MAX_QUERY_LIMIT } from '../constants';
import { findAllPaginatedUsersRaw } from './user';
import { processFilters } from '../utils/common';

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

export const createCampaign = async ({ name, message, allocated_msg_count, description, segmentIds, order, scheduled_time }) => {
    const campaign = await db.Campaign.create({
        name,
        message,
        allocated_msg_count,
        description,
        scheduled_time,
        status: CAMPAIGN_STATUS.RUNNING
    });
    const filters = (await getListFilters(segmentIds)).map(processFilters);
    const where = {
        [Op.or]: filters
    }
    let offset = 0;
    let users;
    do {
        users = await findAllPaginatedUsersRaw({ offset, where, order });
        await campaign.addUsers(users);
        offset = offset + MAX_QUERY_LIMIT_RAW
    } while (users.length >= MAX_QUERY_LIMIT_RAW);
    users = null;
    return campaign;
}


export const getCampaignUserPaginated = async ({ id, limit, offset, order }) => {
    if (!limit || limit > MAX_QUERY_LIMIT) {
        limit = MAX_QUERY_LIMIT;
    }
    return await db.CampaignUser.findAll({
        where: {
            campaign_id: id
        },
        offset,
        limit,
        order,
        include: [{
            model: db.User,
        }]
    })
}
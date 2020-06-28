import Op from 'sequelize/lib/operators';
import db from '../models';
import { getLists } from './list';
import { CAMPAIGN_STATUS, MAX_QUERY_LIMIT_RAW, MAX_QUERY_LIMIT, CAMPAIGN_MESSAGE_STATUS } from '../constants';
import { findAllPaginatedUsersRaw } from './user';
import { processFilters } from '../utils/common';

export const getCampaign = async (id) => {
    return await db.Campaign.findByPk(id);
}
export const updateCampaign = async (id, properties) => {
    const campaign = await db.Campaign.findByPk(id);
    campaign.update(properties);
    return await campaign.save();
}
export const deleteCampaign = async (campaign_id) => {
    const campaign = await db.Campaign.findByPk(campaign_id);
    await db.CampaignUser.destroy({
        where: { campaign_id }
    })
    await db.CampaignJobHistory.destroy({
        where: { campaign_id }
    });
    return await campaign.destroy();
}

export const getAllActiveCampaign = async () => {
    return await db.Campaign.findAll({ where: { status: CAMPAIGN_STATUS.SCHEDULED } });
}

export const getAllCampaigns = async (params) => {
    return await db.Campaign.findAll(params);
}

export const createCampaign = async ({ name, message, allocated_msg_count, description, segmentIds = [], order, scheduled_time }) => {

    let where = {};
    const metadata = { order }
    if (segmentIds.length !== 0) {
        const lists = await getLists(segmentIds);
        where[Op.or] = [];
        metadata.segments = [];
        lists.forEach(list => {
            list = list.toJSON();
            where[Op.or].push(processFilters(list.filters));
            metadata.segments.push(list);
        });
    }
    const campaign = await db.Campaign.create({
        name,
        message,
        allocated_msg_count,
        description,
        scheduled_time,
        metadata,
        status: CAMPAIGN_STATUS.SCHEDULED
    });

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
    return await db.CampaignUser.findAndCountAll({
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

export const getCampaignScheduledUsers = async ({ id, limit }) => {
    return await db.CampaignUser.findAll({
        where: {
            campaign_id: id,
            status: CAMPAIGN_MESSAGE_STATUS.SCHEDULED
        },
        limit
    })
}

export const deleteAllCampaigns = async () => {
    await db.CampaignUser.destroy({
        where: {},
        truncate: true
    });
    await db.CampaignJobHistory.destroy({
        where: {},
        truncate: true
    });
    await db.Campaign.destroy({
        where: {},
        truncate: true
    });
    return true;
}
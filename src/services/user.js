import Op from 'sequelize/lib/operators';
import db from '../models';
import { getLists } from './list';
import { FOLLOWER_SYNC_STATUS, MAX_QUERY_LIMIT, MAX_QUERY_LIMIT_RAW, MAX_USERS_LOOKUP_LIMIT } from '../constants';
import { processFilters } from '../utils/common';

const addBaseCondition = (where) => {
    where = where || {};
    if (where[Op.and]) {
        where[Op.and].status = FOLLOWER_SYNC_STATUS.SYNCED;
    }
    else {
        where[Op.and] = {
            status: FOLLOWER_SYNC_STATUS.SYNCED
        }
    }
    return where;
}

export const bulkCreate = async (users) => {
    return await db.User.bulkCreate(users, { updateOnDuplicate: ["screen_name", "name", "location", "followers_count", "friends_count", "statuses_count", "verified", "protected", "description", "listed_count", "favourites_count", "statuses_count", "default_profile", "default_profile_image", "profile_image_url_https", "status"] });
}

export const findAllPaginatedUsers = async ({ where, order, limit, offset, segmentIds }) => {
    if (segmentIds && segmentIds.length !== 0) {
        where = {
            [Op.or]: (await getLists(segmentIds)).map(list => processFilters(list.get("filters")))
        }
    }
    else if (where) {
        where = processFilters(where)
    }
    where = addBaseCondition(where);
    if (!limit || limit > MAX_QUERY_LIMIT) {
        limit = MAX_QUERY_LIMIT;
    }
    return await db.User.findAndCountAll({
        limit,
        offset,
        where,
        order
    });
}

export const findAllPaginatedUsersRaw = async ({ where, order, limit, offset }) => {
    if (!limit || limit > MAX_QUERY_LIMIT_RAW) {
        limit = MAX_QUERY_LIMIT_RAW;
    }
    where = addBaseCondition(where);
    return await db.User.findAll({
        limit,
        offset,
        where,
        order
    });
}
export const findAllUsers = async ({ where }) => {
    where = addBaseCondition(where);
    return await db.User.findAll({
        where
    });
}

export const findUsersCount = async ({ where }) => {
    where = addBaseCondition(where);
    return await db.User.count({
        where
    });
}

export const findUnSyncedUsers = async () => {
    return await db.User.findAll({
        where: {
            status: FOLLOWER_SYNC_STATUS.NOT_SYNCED,
        },
        limit: MAX_USERS_LOOKUP_LIMIT
    });
}

export const findUser = async (where) => {
    return await db.User.findOne({ where });
}

export const deleteAllUsers = async () => {
    await db.User.destroy({
        where: {},
        truncate: true
    });
}
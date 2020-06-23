import db from '../models';

export const add = async (userObject) => {
    const result = await db.User.create({
        ...userObject
    });
    return result.get("id_str");
}

export const bulkCreate = async (users) => {
    return await db.User.bulkCreate(users, { updateOnDuplicate: ["screen_name", "name", "location", "followers_count", "friends_count", "statuses_count", "verified", "protected", "description", "listed_count", "favourites_count", "statuses_count", "default_profile", "default_profile_image"] });
}

export const findAllPaginatedUser = async ({where, order, limit, offset}) => {
    return await db.User.findAll({
        limit,
        offset,
        where,
        order
    });
}
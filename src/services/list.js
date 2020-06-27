import db from '../models';
export const createList = async ({ name, description, filters }) => {
    return await db.List.create({
        name,
        description,
        filters
    });
}

export const getList = async (id) => {
    return await db.List.findByPk(id);
}

export const deleteList = async (id) => {
    const list = await db.List.findByPk(id);
    return await list.destroy();
}


export const getLists = async (ids) => {
    return await db.List.findAll({
        where: {
            id: ids
        }
    });
}


export const updateList = async (id, properties) => {
    return await db.List.update(properties, { where: { id } });
}

export const getAllLists = async () => {
    return await db.List.findAll();
}

export const deleteAllLists = async () => {
    await db.List.destroy({
        where: {},
        truncate: true
    });
}
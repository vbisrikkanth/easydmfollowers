import db from '../models';

export const createList = async ({ name, description, filters }) => {
    const result = await db.List.create({
        name,
        description,
        filters
    });
    return result.toJSON();
}

export const getList = async (id) => {
    const result = await db.List.findByPk(id);
    return result.toJSON();
}

export const updateList = async (id, properties) => {
    const result = await db.List.update(properties, { where: { id } });
    return result.toJSON();
}

export const getAllLists = async () => {
    const results = await db.List.findAll();
    return results.map(list => list.toJSON());
}
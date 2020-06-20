import db from '../models';

const add = async ({ name, description, filter }) => {
    const result = await db.List.create({
        name,
        description,
        filter
    });
    return result.toJSON();
}

const update = async (id, properties) => {
    const result = await db.List.update(properties, { where: { id } });
    return result.toJSON();
}

const getAll = async () => {
    const results = await db.List.findAll();
    return results.map(list => list.toJSON());
}

export default { add, getAll, update };
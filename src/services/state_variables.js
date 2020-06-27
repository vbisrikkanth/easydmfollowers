import db from '../models';

export const setVariable = async (property, value) => {
    await db.StateVariable.upsert({
        property,
        value
    })
}

export const getVariable = async (property) => {
    const result = await db.StateVariable.findByPk(property);
    return result.get("value");
}

export const setVariables = async (variables) => {
    const result = await db.StateVariable.bulkCreate(variables, { updateOnDuplicate: ['value'] });
    return result.map(item => item.toJSON());
}

export const getVariables = async (propertyNames) => {
    const result = await db.StateVariable.findAll({
        where: {
            property: propertyNames
        }
    });
    return result.reduce(((acc, item) => {
        acc[item.get("property")] = item.get("value");
        return acc;
    }), {});
}

export const deleteAllVariables= async () => {
    await db.StateVariable.destroy({
        where: {},
        truncate: true
    });
}
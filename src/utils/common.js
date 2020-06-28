import { between } from 'sequelize/lib/operators';
import { FILTER_OPERATOR_MAP } from '../constants';
export const getCurrentTimeMinutes = () => {
    const now = new Date();
    return (now.getHours() * 60) + now.getMinutes();
}

export const getTimeStamp = (minutes, dayOffset = 0) => {
    const date = new Date();
    date.setHours(Math.floor(minutes / 60), minutes % 60, 0);
    if (dayOffset) {
        const currentDate = date.getDate();
        date.setDate(currentDate + dayOffset);
    }
    return date;
}

export const isToday = (timestamp) => {
    const now = new Date();
    return now.getDate() === timestamp.getDate()
        && now.getMonth() === timestamp.getMonth()
        && now.getFullYear() === timestamp.getFullYear()
}

export const processFilters = ({ filterType, conditions }) => {
    const conditionsMap = {};
    filterType = FILTER_OPERATOR_MAP[filterType];
    conditions.forEach(condition => {
        const operator = FILTER_OPERATOR_MAP[condition.operator];
        if (!conditionsMap[condition.id]) {
            conditionsMap[condition.id] = {
                [filterType]: []
            };
        }
        conditionsMap[condition.id][filterType].push({
            [operator]: condition.value
        });
    });
    return { [filterType]: conditionsMap }

}

export const stillNowTimeFilter = () => {
    const _12AMTime = new Date();
    _12AMTime.setHours(0, 0, 0);
    return {
        [between]: [_12AMTime, new Date()]
    }
}
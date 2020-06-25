export const getCurrentTimeMinutes = () => {
    const now = new Date();
    return (now.getHours() * 60) + now.getMinutes();
}

export const getTimeStamp = (minutes) => {
    const date = new Date();
    date.setHours(Math.floor(minutes / 60), num % 60, 0);
    return date;
}

export const isToday = (timestamp) => {
    const now = new Date();
    return now.getDate() === timestamp.getDate()
        && now.getMonth() === timestamp.getMonth()
        && now.getFullYear() === timestamp.getFullYear()
}
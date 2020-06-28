export const scheduleCron = (dateTime, job) => {
    const delay = dateTime.getTime() - (new Date()).getTime();
    return setTimeout(job, delay);
}
export const scheduleCron = (dateTime, job) => {
    console.log(dateTime);
    const delay = dateTime.getTime() - (new Date()).getTime();
    return setTimeout(job, delay);
}
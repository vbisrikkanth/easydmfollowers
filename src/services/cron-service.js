export const scheduleCron = (dateTime, job) => {
    const delay = dateTime.getTime() - (new Date()).getTime();
    console.log("scheduleCron -> delay", delay);
    return setTimeout(job, delay);
}
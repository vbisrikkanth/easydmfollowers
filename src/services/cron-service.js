import logger from "../utils/logger";

export const scheduleCron = (dateTime, job) => {
    const delay = dateTime.getTime() - (new Date()).getTime();
    logger.info("scheduleCron -> delay", delay);
    logger.info("scheduleCron -> time", dateTime);
    return setTimeout(job, delay);
}
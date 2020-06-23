export const CAMPAIGN_STATUS = {
    NOT_STARTED: 10,
    RUNNING: 20,
    PAUSE: 30,
    DONE: 40
}

export const JOB_STATUS = {
    SCHEDULED: 10,
    FAILED: 30,
    DONE: 40
}

export const CAMPAIGN_MESSAGE_STATUS = {
    SCHEDULED: 10,
    FAILED: 30,
    SEND: 40
}

export const TWITTER_CLIENT_STATE = {
    NOT_INITIALIZED: 10,
    INITIALIZED: 20
}

export const MAX_QUERY_LIMIT = 2000;

// TBD Need update it using rate limit it api
export const DAILY_DM_LIMIT = 1000;
import db from '../models';
import { JOB_STATUS } from '../constants';

export const createCampaignJob = async ({ campaign_id }) => {
    return await db.CampaignJobHistory.create({
        campaign_id,
        ran_at: new Date(),
        status: JOB_STATUS.SCHEDULED
    });
}

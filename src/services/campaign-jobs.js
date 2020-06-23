import db from '../models';
import { JOB_STATUS } from '../constants';

export const  getActiveJobForCampaign = async (campaign_id) => {
    return await db.CampaignJob.findOne({
        where: {
            campaign_id,
            status: JOB_STATUS.SCHEDULED
        }
    });
}

export const createCampaignJob = async ({ campaign_id, scheduled }) => {
    return await db.CampaignJob.create({
        campaign_id,
        scheduled,
        status: JOB_STATUS.SCHEDULED
    });
}

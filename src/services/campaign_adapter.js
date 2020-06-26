import { createCampaignJob } from './campaign-jobs';
import { getAllActiveCampaign, updateCampaign, deleteCampaign, createCampaign } from './campaign';
import { scheduleCron } from './cron-service';
import { JOB_STATUS, CAMPAIGN_MESSAGE_STATUS, TWITTER_CLIENT_STATE, DAILY_DM_LIMIT, CAMPAIGN_STATUS } from '../constants';
import { isToday, getCurrentTimeMinutes, getTimeStamp } from '../utils/common'
class CampaignAdapter {
    constructor(twitterAdapter) {
        this.campaignCronMap = {};
        this.twitterAdapter = twitterAdapter;
        this.init();
    }

    async init() {
        const { futureCampaigns } = await this.getAllCampaigns();
        futureCampaigns.map(this.scheduleCronForCampaign);
    }
    async getAllCampaigns() {
        const activeCampaigns = await getAllActiveCampaign();
        const missedCampaigns = [];
        const futureCampaigns = [];
        activeCampaigns.forEach((campaign) => {
            const lastRun = campaign.get("last_run");
            const scheduleTime = campaign.get("scheduled_time");
            if (isToday(lastRun)) {
                return;
            }
            if (scheduleTime < getCurrentTimeMinutes()) {
                missedCampaigns.push(campaign);
            } else {
                futureCampaigns.push(campaign);
            }
        });
        return { missedCampaigns, futureCampaigns };
    }

    async updateCampaign(id, properties) {
        const campaign = await updateCampaign(id, properties);
        scheduleCron(campaign);
        return campaign;
    }

    async createCampaign(campaignProps) {
        const campaign = await createCampaign(campaignProps);
        this.scheduleCronForCampaign(campaign);
        return campaign;
    }

    async deleteCampaign(id) {
        if (this.campaignCronMap[id]) {
            clearTimeout(this.campaignCronMap[id])
            this.campaignCronMap[id] = null;
        }
        return await deleteCampaign(id);
    }

    scheduleCronForCampaign = (campaign) => {
        const id = campaign.get("id");
        const status = campaign.get("status");
        const scheduled = getTimeStamp(campaign.get("scheduled_time"));
        if (this.campaignCronMap[id]) {
            clearTimeout(this.campaignCronMap[id])
            this.campaignCronMap[id] = null;
        }
        if (status === CAMPAIGN_STATUS.RUNNING)
            this.campaignCronMap[id] = scheduleCron(scheduled, () => {
                this.runCampaignJob(campaign)
            });
        console.log("CampaignAdapter -> scheduleCronForCampaign", id);
    }

    async runCampaignJob(campaign) {
        if (campaign.get("status") !== CAMPAIGN_STATUS.RUNNING) {
            return;
        }
        const now = new Date();
        const job = await createCampaignJob({ campaign_id: campaignId, scheduled: now });
        const jobId = job.get("id");
        const noOfMessagesCanBeSent = campaign.get("allocated_msg_count");
        const message = campaign.get("message");
        const campaignUsers = await campaign.getCampaignUser({
            limit: noOfMessagesCanBeSent,
            where: { status: CAMPAIGN_MESSAGE_STATUS.SCHEDULED }
        });
        for (let campaignUser of campaignUsers) {
            const user = campaignUser.getUser();
            try {
                await this.twitterAdapter.sendDM({ text: message , user});
                campaignUser.status = CAMPAIGN_MESSAGE_STATUS.SEND;
            }
            catch (e) {
                if (e.errors[0].code !== 88) {
                    job.status = JOB_STATUS.LIMIT_EXCEEDED
                    await job.save();
                    break;
                }
                campaignUser.status = CAMPAIGN_MESSAGE_STATUS.FAILED;
            }
            finally {
                campaignUser.job_id = jobId;
                await campaignUser.save()
            }
        }
        const hasActiveUsers = (await campaign.getCampaignUser({
            limit: 1,
            where: { status: CAMPAIGN_MESSAGE_STATUS.SCHEDULED }
        })).length !== 0;

        hasActiveUsers ? campaign.status = JOB_STATUS.DONE : scheduleCronForCampaign(campaign);
        campaign.last_run = now;
        await campaign.save();
    }

}

export default CampaignAdapter;
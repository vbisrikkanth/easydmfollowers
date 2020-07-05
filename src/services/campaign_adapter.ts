import { createCampaignJob } from './campaign-jobs';
import { getAllActiveCampaign, updateCampaign, deleteCampaign, createCampaign, getCampaignScheduledUsers } from './campaign';
import { scheduleCron } from './cron-service';
import { JOB_STATUS, CAMPAIGN_MESSAGE_STATUS, CAMPAIGN_STATUS, CAMPAIGN_JOB_STATUS } from '../constants';
import { isToday, getCurrentTimeMinutes, getTimeStamp } from '../utils/common'
import TwitterAdapter from './twitter_adapter';
import { Campaign } from '../models/campaign';
import { CampaignUpdateAttributes, CampaignCreateAttribute } from '../types';
import { UserAttributes } from '../models/user';
class CampaignAdapter {
    private notifier: Function;
    private campaignCronMap: any;
    private twitterAdapter: TwitterAdapter;
    constructor(twitterAdapter: TwitterAdapter, notifier: Function) {
        this.notifier = notifier;
        this.campaignCronMap = {};
        this.twitterAdapter = twitterAdapter;
        this.init();
    }

    async init() {
        const activeCampaigns = await getAllActiveCampaign();
        activeCampaigns.map(this.scheduleCronForCampaign);
    }
    async getAllMissedCampaigns() {
        const activeCampaigns = await getAllActiveCampaign();
        return activeCampaigns.filter((campaign) => {
            const lastRun = campaign.get("last_run");
            const scheduleTime = campaign.get("scheduled_time");
            if ((!lastRun || !isToday(lastRun)) && scheduleTime < getCurrentTimeMinutes()) {
                return true;
            }
            return false;
        });
    }

    async updateCampaign(id: number, properties: CampaignUpdateAttributes) {
        const campaign = await updateCampaign(id, properties);
        if (!campaign) return null;
        this.scheduleCronForCampaign(campaign);
        return campaign;
    }

    async createCampaign(campaignProps: CampaignCreateAttribute) {
        const campaign = await createCampaign(campaignProps);
        this.scheduleCronForCampaign(campaign);
        return campaign;
    }

    async deleteCampaign(id: number) {
        if (this.campaignCronMap[id]) {
            clearTimeout(this.campaignCronMap[id])
            delete this.campaignCronMap[id];
        }
        return await deleteCampaign(id);
    }

    reset = () => {
        Object.keys(this.campaignCronMap).forEach(key => {
            clearTimeout(this.campaignCronMap[key]);
        });
    }

    scheduleCronForCampaign = (campaign: Campaign) => {
        const id = campaign.get("id");
        const status = campaign.get("status");
        const scheduleTime = campaign.get("scheduled_time");
        if (this.campaignCronMap[id]) {
            clearTimeout(this.campaignCronMap[id])
            this.campaignCronMap[id] = null;
        }
        if (status !== CAMPAIGN_STATUS.SCHEDULED) {
            return;
        }
        const scheduled = getTimeStamp(scheduleTime, scheduleTime <= getCurrentTimeMinutes() ? 1 : 0);
        this.campaignCronMap[id] = scheduleCron(scheduled, () => {
            this.runCampaignJob(campaign)
        });
    }

    async runCampaignJob(campaign: Campaign) {
        if (campaign.get("status") !== CAMPAIGN_STATUS.SCHEDULED) {
            return;
        }
        const now = new Date();
        const job = await createCampaignJob(campaign.get("id"));
        const jobId = job.get("id");
        const noOfMessagesCanBeSent = campaign.get("allocated_msg_count");
        const message = campaign.get("message");
        const campaignUsers = await getCampaignScheduledUsers({
            id: campaign.get("id"),
            limit: noOfMessagesCanBeSent,
        });
        for (let campaignUser of campaignUsers) {
            const user = await campaignUser.getUser();
            try {
                await this.twitterAdapter.sendDM({ message, user: <UserAttributes>user.toJSON() });
                campaignUser.status = CAMPAIGN_MESSAGE_STATUS.SEND;
            }
            catch (e) {
                if (e.errors[0].code === 88) {
                    job.status = CAMPAIGN_JOB_STATUS.LIMIT_EXCEEDED
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
        const hasActiveUsers = (await getCampaignScheduledUsers({
            id: campaign.get("id"),
            limit: 1
        })).length > 0;
        campaign.last_run = now;
        hasActiveUsers ? this.scheduleCronForCampaign(campaign) : campaign.status = JOB_STATUS.DONE;
        await campaign.save();
    }

}

export default CampaignAdapter;
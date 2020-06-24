import { getActiveJobForCampaign, createCampaignJob } from './campaign-jobs';
import { getCampaign, getAllActiveCampaign } from './campaign';
import { scheduleCron } from './cron-service';
import { JOB_STATUS, CAMPAIGN_MESSAGE_STATUS, TWITTER_CLIENT_STATE, DAILY_DM_LIMIT, CAMPAIGN_STATUS } from '../constants';
class CampaignAdapter {
    constructor(twitterAdapter) {
        this.campaignCronMap = {};
        this.twitterAdapter = twitterAdapter;
        if (twitterAdapter.clientState === TWITTER_CLIENT_STATE.INITIALIZED)
            initAllActiveCampaigns();
    }
    async initAllActiveCampaigns() {
        const activeCampaigns = await getAllActiveCampaign();
        
        // activeCampaigns.forEach((campaign) => this.runCampaign(campaign))
    }

    async runCampaign(campaign, force = false) {
        campaign = typeof campaign === "object" ? campaign : await getCampaign(campaign);
        let job = await getActiveJobForCampaign(campaignId);
        if (!force && !job) {
            return;
        }
        if (!job) {
            job = await createCampaignJob({ campaign_id, scheduled: new Date() });
        }
        if (job.get("scheduled") < new Date()) {
            this.runCampaignJob(campaign, job);
            return;
        }
        if (this.campaignCronMap[campaignId]) {
            clearTimeout(this.campaignCronMap[campaignId])
        }
        this.campaignCronMap[campaignId] = scheduleCron(scheduled, () => {
            this.runCampaignJob(campaign, job)
        });
    }

    async updateCampaignStatus(campaignId, status){
        const campaign = await getCampaign(campaignId);
        let job = await getActiveJobForCampaign(campaignId);
        if (!job && status === CAMPAIGN_STATUS.RUNNING) {
             job = await createCampaignJob({ campaign_id: campaignId, scheduled: new Date() });   
        }
        if(status === CAMPAIGN_STATUS.RUNNING){
            this.runCampaignJob(campaign, job);
        }
        else if(status === CAMPAIGN_STATUS.PAUSED){
            job.status = JOB_STATUS.CLOSED;
            await job.save();
            campaign.status = CAMPAIGN_STATUS.PAUSED;
            await campaign.save();
        }
    }

    async runCampaignJob(campaign, campaignJob) {
        if (job.get("status").status !== JOB_STATUS.SCHEDULED) {
            return;
        }
        const jobId = campaignJob.get("id");
        const noOfMessagesCanBeSent = campaign.get("weight") * DAILY_DM_LIMIT;
        const message = campaign.get("message");
        const campaignUsers = await campaign.getCampaignUser({
            limit: noOfMessagesCanBeSent,
            where: { status: CAMPAIGN_MESSAGE_STATUS.SCHEDULED }
        });
        for (let campaignUser of campaignUsers) {
            const user = campaignUser.getUser();
            try {
                await this.twitterAdapter.sendMessage(message, user);
                campaignUser.status = CAMPAIGN_MESSAGE_STATUS.SEND;
                await campaignUser.save()
            }
            catch (e) {
                if (e.errors[0].code !== 88) {
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

        campaignJob.status = JOB_STATUS.DONE;
        await campaignJob.save();
        if (hasActiveUsers) {
            const campaignId = campaign.get("id");
            const scheduled = new Date((new Date()).getTime() + 60 * 60 * 24 * 1000);
            const nextJob = await createCampaignJob({ campaign_id: campaignId, scheduled });
            this.campaignCronMap[campaignId] = scheduleCron(scheduled, () => {
                this.runCampaignJob(campaign, nextJob)
            });
        }

    }
}

export default CampaignAdapter;
import axios, {AxiosError} from "axios";
import slackify from 'slackify-markdown'
import { Logger, ILogObj } from "tslog";
const log: Logger<ILogObj> = new Logger();

const {
    SLACK_URL,
} = process.env

export class SlackService {
    private baseUrl = SLACK_URL ?? ''
    constructor() {
        if (!SLACK_URL) throw new Error('SLACK_URL environment variable not defined')
    }
    public async message(from:string,content:string,link:string){
        try {
            await axios.post(this.baseUrl,{
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `*${from}* created a post`
                        },
                        accessory: {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'View in Workplace',
                                emoji: true
                            },
                            value: 'click_me_123',
                            url: link,
                            action_id: 'button-action'
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: slackify(content)
                        }
                    }
                ]
            });
        } catch (e) {
            if (e instanceof AxiosError) log.error(`Slack send message failed. ${e.message}: ${e.response?.data}`)
            else log.error(e)
        }
    }
}
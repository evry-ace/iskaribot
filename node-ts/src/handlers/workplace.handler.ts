import { Logger, ILogObj } from "tslog";
const log: Logger<ILogObj> = new Logger();
import {SlackService} from "../services/slack.service";
import {Entry} from "../entities/workplaceRequest";
import {SubscriptionField} from "../enums/workplaceEnums";

export async function handleGroup(entries: Entry[]) {
    const slack = new SlackService()
    
    for (const entry of entries) {
        for (const change of entry.changes) {
            switch (change.field) {
                case SubscriptionField.posts: {
                    const { from, message, permalink_url } = change.value
                    log.info(`\n\nNew Post:\nFrom: ${from.name}\nMessage:\n${message}\nLink: ${permalink_url}\n`)
                    await slack.message(from.name,message,permalink_url)
                    break;
                }
                default:
                    log.warn('Unhandled SubscriptionField', change.field);
            }
        }
    }
}
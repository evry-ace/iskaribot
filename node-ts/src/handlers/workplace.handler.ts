import { Logger, ILogObj } from "tslog";
const log: Logger<ILogObj> = new Logger();
import {Entry} from "../entities/workplaceRequest";
import {SubscriptionField} from "../enums/workplaceEnums";

export function handleGroup(entries: Entry[]) {
    for (const entry of entries) {
        for (const change of entry.changes) {
            switch (change.field) {
                case SubscriptionField.posts: {
                    const { from, message, permalink_url } = change.value
                    log.info(`\n\nNew Post:\nFrom: ${from.name}\nMessage:\n${message}\nLink: ${permalink_url}\n`)
                    break;
                }
                default:
                    log.warn('Unhandled SubscriptionField', change.field);
            }
        }
    }
}
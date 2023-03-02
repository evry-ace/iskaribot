import {config} from "dotenv";
config({ path: '../.env' });
import {SlackService} from "./slack.service";

describe('init', () => {
    test('can initiate service', async () => {
        new SlackService()
    })
})

describe('message', () => {
    test('can send message', async () => {
        const slack = new SlackService()
        await slack.message('Bjørn Kristian Punsvik', 'Super content', 'https://tietoevry.com/')
    })
})
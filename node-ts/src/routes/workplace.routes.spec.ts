import {config} from "dotenv";
config({ path: '../.env' });
import request from "supertest";
import app from "../../src/app";

describe('/', () => {
    
    test('Verify server', async () => {
        const mode = 'subscribe'
        const challenge = 'random_string'
        const verify_token = process.env.WORKPLACE_VERIFY_TOKEN
        const query = '?'+[
            'hub.mode='+mode,
            'hub.challenge='+challenge,
            'hub.verify_token='+verify_token
        ].join('&')
        
        const res = await request(app)
            .get("/workplace"+query)
            .expect(200);
        
        expect(res.text).toEqual(challenge)
    })


    test('post', async () => {
        const body = {
            "entry": [
                {
                    "id": "1059917401446886",
                    "time": 1677658637,
                    "changes": [
                        {
                            "value": {
                                "created_time": "2023-03-01T08:17:13+0000",
                                "community": {
                                    "id": "1427629113928236"
                                },
                                "from": {
                                    "id": "100090717730254",
                                    "name": "Bjørn Kristian Punsvik"
                                },
                                "message": "# Test Post\n\nbest body",
                                "permalink_url": "https://evrystratus.workplace.com/groups/1059917401446886/permalink/1390093621762594/",
                                "post_id": "1059917401446886_1390093621762594",
                                "target_type": "group",
                                "type": "status",
                                "verb": "add"
                            },
                            "field": "posts"
                        }
                    ]
                }
            ],
            "object": "group"
        }
        const res = await request(app)
            .post("/workplace")
            .send(body)
            .expect(200);
        
        // expect(res.text).toEqual(challenge)
    })
})
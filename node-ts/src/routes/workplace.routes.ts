import { Router, Request, Response } from "express";
import { Logger, ILogObj } from "tslog";
import { sanitize } from "dompurify"
import {WorkplaceBody} from "../entities/workplaceRequest";
import {Topic} from "../enums/workplaceEnums";
import {handleGroup} from "../handlers/workplace.handler";
const log: Logger<ILogObj> = new Logger();

const {
    WORKPLACE_VERIFY_TOKEN,
} = process.env

const router = Router();

/** Verify server in webhook configuration*/
router.get('/', (req, res) => {
    const { mode, challenge, verify_token } = {
        mode: req.query["hub.mode"] ?? '',
        challenge: req.query["hub.challenge"] ?? '',
        verify_token: req.query["hub.verify_token"] ?? '',
    }
    
    if (!(mode === 'subscribe' && verify_token === WORKPLACE_VERIFY_TOKEN)) {
        log.error('Failed validation. Make sure the validation tokens match.')
        res.sendStatus(403);
        return
    }
    
    log.debug('Validating webhook')
    res.status(200).send(sanitize(challenge.toString()))
});


router.post('/', async (req: Request<unknown,unknown,WorkplaceBody>, res: Response) => {
    try {
        // verifyRequestSignature({},'')
        switch (req.body.object) {
            case Topic.group: 
                await handleGroup(req.body.entry)
                break;
            default:
                log.warn('Unhandled Webhook Object', req.body.object);
        }
    } catch (e) {
        log.error(e);
    } finally {
        res.sendStatus(200);
    }
});

/** Verify that the callback came from Facebook. */
function verifyRequestSignature(payload:unknown,signature:unknown) {
    if (!signature) throw new Error('No signature in header.')
    // const signature = req.headers['x-hub-signature'];
    //
    // if (!signature) {
    //     // Should throw an error
    //     console.error("Couldn't validate the signature");
    // } else {
    //     const elements = signature.split('=');
    //     const signatureHash = elements[1];
    //
    //     const expectedHash = crypto
    //         .createHmac('sha1', APP_SECRET)
    //         .update(buf)
    //         .digest('hex');
    //     if (signatureHash != expectedHash) {
    //         throw new Error("Couldn't validate the request signature.");
    //     }
    // }
}

export { router };
// @ts-check

const express = require('express');
axios = require('axios');

require('dotenv').config();

var app = express();
app.set('port', process.env.PORT || 9000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Config values can be set as environment variables
 * APP_SECRET - App dashboard
 * VERIFY_TOKEN - arbitrary value to verify webhook
 * ACCESS_TOKEN - generated by creating a Custom Integration https://developers.facebook.com/docs/workplace/custom-integrations-new
 */

const APP_SECRET = process.env.APP_SECRET,
  VERIFY_TOKEN = process.env.VERIFY_TOKEN,
  ACCESS_TOKEN = process.env.ACCESS_TOKEN,
  SLACK_URL = process.env.SLACK_URL;

if (!(APP_SECRET && VERIFY_TOKEN && ACCESS_TOKEN)) {
  console.error('Missing configuration values');
  process.exit(1);
}

app.get('/', (req, res) => {
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === VERIFY_TOKEN
  ) {
    console.log('Validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});

app.post('/', (req, res) => {
  try {
    var data = req.body;
    //console.log(data)
    switch (data.object) {
      case 'page':
        processPageEvents(data);
        break;
      case 'group':
        //Quick and dirty fix for repeating messages
        res.sendStatus(200);
        processGroupEvents(data);
        break;
      case 'user':
        processUserEvents(data);
        break;
      case 'workplace_security':
        processWorkplaceSecurityEvents(data);
        break;
      default:
        console.log('Unhandled Webhook Object', data.object);
    }
  } catch (e) {
    console.error(e);
    // Always respond with 200 OK to avoid retries
    res.sendStatus(200);
  }
});

function processPageEvents(data) {
  data.entry.forEach(function (entry) {
    let page_id = entry.id;
    // Chat messages sent to the page
    if (entry.messaging) {
      entry.messaging.forEach(function (messaging_event) {
        console.log('Page Messaging Event', page_id, messaging_event);
      });
    }
    // Page related changes, or mentions of the page
    if (entry.changes) {
      entry.changes.forEach(function (change) {
        console.log('Page Change', page_id, change);
      });
    }
  });
}
function processGroupEvents(data) {
  data.entry.forEach(function (entry) {
    let group_id = entry.id;
    let wp_post = '';
    entry.changes.forEach(function (change) {
      console.log('Group change', group_id, change, change.value.permalink_url);
      wp_post += `${change.value.from.name} posted: ${change.value.message}\n\n${change.value.permalink_url}`;
    });

    axios({
      method: 'post',
      url: SLACK_URL,
      data: {
        text: wp_post,
      },
    })
      .then(response => {
        const html = response.data;
        console.log(wp_post);
        //console.log(permalink_url);
      })
      .catch(function (error) {
        //console.log(error);
      });
  });
}

/* Verify that the callback came from Facebook.
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers['x-hub-signature'];

  if (!signature) {
    // Should throw an error
    console.error("Couldn't validate the signature");
  } else {
    var elements = signature.split('=');
    var signatureHash = elements[1];

    var expectedHash = crypto
      .createHmac('sha1', APP_SECRET)
      .update(buf)
      .digest('hex');
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
module.exports = app;

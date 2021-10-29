# Iskaribot

Iskaribot is a Facebook Workplace -> Slack message cross-poster, which registers for webhooks and listes for posts to a particular Workplace group. When receiving such a webhook, it will resend the post to a configured Slack-channel (or channels) with a link back to the original post and an ingress.

This bot solves the age-old conundrum of how to get developers to read corporate news.

## Prerequisites

You need an account in a corporate Facebook Workplace tenant, so if you are not the system administrator (likely not) you will need to cosy up to someone who is, and have them help you out with the proper permissions to read data from Workplace and to register the webhook.
You then need to repeat the similar procedure on the Slack-side, so you get a Slack webhook URL to post the content to.

## Development

Iskaribot was built using Node 16.1.0 and NPM 7.24.0 so you should be safe if you have the same versions, others at your peril. Not really.

You will also need Git if you want to clone this repository.

Then you will need a public TLS-enabled endpoint for your localhost process, so why don't you give [ngrok](https://ngrok.com/) a try?

### Run Iskaribot locally

1. Clone this repository.
1. Install dependencies by running `npm install`
1. Install `nodemon` globally with `npm i -g nodemon`
1. Add configuration data to the included `rename.env` file and rename the file to `.env`. Optionally, and for production deployment, the configuration can be added as environment variables.
1. Run the bot with `npm start` which will run nodemon and listen for changes to the application...

### Configure ngrok

To get webhooks from Workplace to hit your local development environment, you need a public TLS-enabled endpoint to forward the webhook for you. Register at [ngrok](https://ngrok.com), follow the instructions there to get your local ngrok client configured.

Run ngrok pointing it to the same TCP port as your local Iskaribot. Default port is 7506. It can look something like this, once running:

<img src="images/ngrok_client.png" width=500>

### Configure Facebook Workplace

Using 'Integrations' in Workplace, you can configure a webhook to trigger Iskaribot whenever there is a new post in your WP group.

1. From the left-hand Admin Panel menu: <img src="images/admin_panel.png" width=40>
1. Choose Integrations: <img src="images/integrations.png" height=40>
1. Click 'Create Custom Integration' and fill in name and description. Suggest name 'Iskaribot' and description pointing to our Github repo. :)
1. On the page for this integration, choose Webhooks <img src="images/webhooks.png" height=40>
1. Choose Permissions. Tick 'Read group content'.
1. On th same page, find 'Give integration access to groups', and open 'Group permissions'. Either tick 'All groups', or add your group(s) to 'Specific groups'.
1. On the webhooks page, open 'Groups' and enter the following information:

- Callback URL set to the HTTPS URL of your ngrok client.
- Verify token set to the same value as in your local `.env` file.
- Tick 'posts' to enable the webhook to be 'triggered when a post is added, updated or deleted in a group'.

## Deployment

TODO: Dockerfile to build container image for deployment.

## API documentation

### Facebook API

- [Getting Started](https://developers.facebook.com/docs/graph-api/webhooks/getting-started)
- [Permissions](https://developers.facebook.com/docs/workplace/reference/permissions)

### Slack API

- [Incoming webhooks for Slack](https://slack.com/intl/en-no/help/articles/115005265063-Incoming-webhooks-for-Slack)

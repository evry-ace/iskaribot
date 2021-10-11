# Iskaribot

Iskaribot is a Facebook Workplace -> Slack message cross-poster, which registers for webhooks and listes for posts to a particular Workplace group. When receiving such a webhook, it will resend the post to a configured Slack-channel (or channels) with a link back to the original post and an ingress.

This bot solves the age-old conundrum of how to get developers to read corporate news.

## Prerequisites

You need an account in a corporate Facebook Workplace tenant, so if you are not the system administrator (likely not) you will need to cosy up to someone who is, and have them help you out with the proper permissions to read data from Workplace and to register the webhook.
You then need to repeat the similar procedure on the Slack-side, so you get a Slack webhook URL to post the content to.

## Development

Iskaribot was built using Node 16.1.0 and NPM 7.24.0 so you should be safe if you have the same versions.

You will also need Git if you want to clone this repository.

1. Clone this repository.
2. Install dependencies by running `npm install`
3. Add configuration data to the included `rename.env` file and rename the file to `.env`. Optionally, and for production deployment, the configuration can be added as environment variables.
4. Run the bot with `npm start`

## Deployment

TODO: Dockerfile to build container image for deployment.

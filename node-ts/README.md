
# Iskaribot.node

Message-relaying bot for cross-posting messages between platforms.


## Run Locally

Clone the project

```bash
  # Clone the project
  git clone https://github.com/evry-ace/iskaribot.git
  
  # Go to the project directory
  cd iskaribot/node
  
  # Install dependencies
  npm install
  
  # Define environment variables in .env

  # Build the program
  npm run build

  # Start the server
  npm run start
  
  
```
- Start ngrok
- Set uri for the ngrok tunnel in workplace integrations
  - `Admin Panel > Integrations > Iskaribot > Webhooks > Groups`
  - callback URL: `https://<ngrok-tunel-domain>/workplace`
  - Verify token: same as in .env
  - 
Ngrok and the server needs to run to validate server when saving webhook config



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` Port the server runs on.

`WORKPLACE_APP_ID` Found under 'details' in workplace.

`WORKPLACE_APP_SECRET` Found under 'details' in workplace.

`WORKPLACE_ACCESS_TOKEN` Generated in workplace under details. can only be viewed once.

`WORKPLACE_VERIFY_TOKEN` Self-defined, must be the same in workplace config and .env file.

`SLACK_URL` Url for the webhook used for posting messages.



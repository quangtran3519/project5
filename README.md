# About

Allow user to write diary

# Functionality of the application

This application will allow creating/removing/updating/fetching/searching diary items.
Each user only has access to diary items that they have created.



* Get all item and search function !
![Alt text](images/diary_home.png?raw=true "Get All and Search")

* Create new item function !
![Alt text](images/diary_create.png?raw=true "Create")

* Update item function !
![Alt text](images/diary_update.png?raw=true "Update")

* Search item function !
![Alt text](images/diary_search.png?raw=true "Send")

* All of the backend function 
![Alt text](images/diary-function.png?raw=true "Send")

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = `uplk9vxj2k`
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: `dev-jfzgpwbu.us.auth0.com`,            // Auth0 domain
  clientId: `yk5dGxdQP7wUhqlofjaCU5xZLXzX6Wzc`,          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
```


# Monitoring 

## X-Race Trace
X-Ray is enabled for every function !
![Alt text](images/diary_xray.png?raw=true "X-Ray Service Map")

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```


![Alt text](images/diary_log.png?raw=true "Log Group")

![Alt text](images/diary_streamlog.png?raw=true "stream log")

![Alt text](images/diary_logconsole.png?raw=true "Log For 1 Function")

# How to run the application

## Backend

You don't have to config any more in this section, it's running in lambda !

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

If we have problem with ERR_OSSL_EVP_UNSUPPORTED, please add this command before `npm run start` : `export NODE_OPTIONS=--openssl-legacy-provider`

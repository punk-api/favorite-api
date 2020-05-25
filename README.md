# Favorite API
Serverless API endpoint for favorite beers
## Development
To get going locally install node modules, copy `.env.example` to `.env` and edit values, install local dynamodb and run serverless-offline:
```
npm install
cp .env.example .env
serverless dynamodb install
serverless offline start
```
## Deployment
Run following command after having setup AWS credentials and base config (domain name and certificate):
`npm run deploy`
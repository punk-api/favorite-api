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

## Loading data into ES
```bash
# get data
git clone https://github.com/samjbmason/punkapi
cd punkapi

# combine all files into one file with index defined
cat data/*.json| jq -c '{"index": {"_index": "beer", "_type": "beer", "_id": .id}}, .' > es-import.json

# import using es bulk import
cat es-import.json| curl -XPOST $ES_ENDPOINT/_bulk --data-binary @-
```
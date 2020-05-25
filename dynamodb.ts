import { DynamoDB } from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

let dynamoDBConfig: DynamoDB.DocumentClient.DocumentClientOptions &
  ServiceConfigurationOptions &
  DynamoDB.ClientApiVersions = {
  region: process.env.REGION,
  convertEmptyValues: true,
};

if (process.env.IS_OFFLINE === "true") {
  console.debug("Using local ddb.");
  dynamoDBConfig = {
    ...dynamoDBConfig,
    region: "local",
    accessKeyId: "DEFAULT_ACCESS_KEY",
    secretAccessKey: "DEFAULT_SECRET",
    endpoint: `http://localhost:8800`,
  };
}

const DynamoAdapter: DynamoDB.DocumentClient = new DynamoDB.DocumentClient(
  dynamoDBConfig
);

export function getAll(params: DocumentClient.ScanInput): Promise<any[]> {
  async function scan(params: DocumentClient.ScanInput): Promise<any[]> {
    try {
      const response = await DynamoAdapter.scan(params).promise();
      const items = response.Items || [];
      if (response.LastEvaluatedKey)
        return [
          ...items,
          ...(await scan({
            ...params,
            ExclusiveStartKey: response.LastEvaluatedKey,
          })),
        ];
      return items;
    } catch (e) {
      console.error(`Error scanning table ${params.TableName}`);
      throw e;
    }
  }
  return scan(params);
}

export { DynamoAdapter };

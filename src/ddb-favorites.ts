import * as ddb from "./dynamodb";

const TableName = "punkapi-favorites";

export async function getAllFavorites(username: string): Promise<string[]> {
  return ddb.DynamoAdapter.query({
    TableName,
    KeyConditionExpression: "pk = :username",
    ExpressionAttributeValues: {
      ":username": username,
    },
  })
    .promise()
    .then((result) => (result.Items || []).map((item) => item.sk));
}

export async function createFavorite(
  username: string,
  id: string
): Promise<void> {
  await ddb.DynamoAdapter.put({
    TableName,
    Item: { pk: username, sk: id },
  }).promise();
}

export async function deleteFavorite(
  username: string,
  id: string
): Promise<void> {
  await ddb.DynamoAdapter.delete({
    TableName,
    Key: { pk: username, sk: id },
  }).promise();
}

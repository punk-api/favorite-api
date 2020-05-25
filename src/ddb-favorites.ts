import * as ddb from "./dynamodb";
import groupBy = require("lodash.groupby");
import mapValues = require("lodash.mapvalues");

const TableName = "punkapi-favorites";

interface DdbItem {
  pk: string;
  sk: string;
}

export async function getAllFavoritesByUser(): Promise<{ [user: string]: string[]}> {
  const items: DdbItem[] = await ddb.getAll({
    TableName,
  });
  const groups = groupBy(items, 'pk');
  return mapValues(groups, (values) => values.map(value => value.sk))
}

export async function getAllFavoritesForUser(username: string): Promise<string[]> {
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

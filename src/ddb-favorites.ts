import * as ddb from "./dynamodb";

const TableName = "punkapi-favorites";

export async function getAllFavorites(): Promise<string[]> {
  return ddb
    .getAll({ TableName })
    .then((items) => items.map((item) => item.pk));
}

export async function createFavorite(id: string): Promise<void> {
  await ddb.DynamoAdapter.put({ TableName, Item: { pk: id } }).promise();
}

export async function deleteFavorite(id: string): Promise<void> {
  await ddb.DynamoAdapter.delete({ TableName, Key: { pk: id } }).promise();
}

const recommend = require("collaborative-filter");
import flatten = require("lodash.flatten");
import orderby = require("lodash.orderby");
import { catchError, error, success } from "./lambda-helpers";
import { getAllFavoritesByUser } from "./ddb-favorites";
import { allItems } from "./all-items";

export function calculate(
  groups: { [groupName: string]: string[] },
  forUser: string
) {
  const users = Object.keys(groups);
  const all = flatten(Object.values(groups));
  const items = all.filter((item, index, all) => all.indexOf(item) === index);
  const ratings = users.map((user) =>
    items.map((item) => (groups[user].includes(item) ? 1 : 0))
  );
  const results: number[] = recommend.cFilter(ratings, users.indexOf(forUser));
  return results.map((result) => items[result]);
}

export async function getRecommendations(
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context
): Promise<AWSLambda.APIGatewayProxyResult> {
  return catchError(async () => {
    if (!event.pathParameters?.username) {
      return error("Specify username", 403);
    }
    const username = event.pathParameters.username;
    const groups = await getAllFavoritesByUser();
    if (!Object.keys(groups).includes(username)) {
      return success([]);
    }
    const recommendations = calculate(groups, username);
    const recommendedItems = recommendations.map((recommendation) =>
      allItems.find((item) => item.id.toString() === recommendation)
    );
    return success(recommendedItems);
  });
}

export async function getMostPopular(
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context
): Promise<AWSLambda.APIGatewayProxyResult> {
  return catchError(async () => {
    const groups = await getAllFavoritesByUser();
    const all = flatten(Object.values(groups));
    const items = all.filter((item, index, all) => all.indexOf(item) === index);
    const itemsWithCount = items.map((item) => ({
      id: item,
      count: all.filter((i) => i === item).length,
    }));
    const itemsWithCountOrdered = orderby(itemsWithCount, "count", "desc");
    const first5 = itemsWithCount.slice(0, 5);
    const mostPopularItems = first5.map((item) => ({
      ...allItems.find((i) => i.id.toString() === item.id),
      favoriteCount: item.count,
    }));
    return success(orderby(mostPopularItems, "favoriteCount", "desc"));
  });
}

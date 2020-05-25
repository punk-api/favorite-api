const recommend = require('collaborative-filter');
import flatten = require("lodash.flatten");
import { catchError, error, success } from "./lambda-helpers";
import { getAllFavoritesByUser } from "./ddb-favorites";
import { allItems } from './all-items';

export function calculate(groups: {[groupName: string]: string[]}, forUser: string) {
    const users = Object.keys(groups);
    const allItems = flatten(Object.values(groups));
    const items = allItems.filter((item, index, all) => all.indexOf(item) === index);
    const ratings = users.map(user => items.map(item => groups[user].includes(item) ? 1 : 0))
    const results: number[] = recommend.cFilter(ratings, users.indexOf(forUser));
    return results.map(result => items[result]);
}

export async function getRecommendations(
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context
): Promise<AWSLambda.APIGatewayProxyResult> {
  return catchError(async () => {
    if (!event.pathParameters?.username) {
      return error("Specify username", 403);
    }
    const recommendations = calculate(await getAllFavoritesByUser(), event.pathParameters.username)
    const recommendedItems = recommendations.map(recommendation => allItems.find(item => item.id.toString() === recommendation));
    return success(recommendedItems);
  });
}

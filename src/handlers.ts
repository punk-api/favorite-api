import {
  getAllFavorites,
  createFavorite,
  deleteFavorite,
} from "./ddb-favorites";

import { catchError, success, error } from "./lambda-helpers";

export async function getAll(
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context
): Promise<AWSLambda.APIGatewayProxyResult> {
  return catchError(async () => {
    return success(await getAllFavorites());
  });
}

export async function create(
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context
): Promise<AWSLambda.APIGatewayProxyResult> {
  return catchError(async () => {
    if (!event.pathParameters?.id) {
      return error("Specify id", 400);
    }
    await createFavorite(event.pathParameters.id);
    return success(null, 201);
  });
}

export async function remove(
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context
): Promise<AWSLambda.APIGatewayProxyResult> {
  return catchError(async () => {
    if (!event.pathParameters?.id) {
      return error("Specify id", 400);
    }
    await deleteFavorite(event.pathParameters.id);
    return success();
  });
}

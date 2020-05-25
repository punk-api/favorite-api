export function success(
  body?: any,
  statusCode?: number
): AWSLambda.APIGatewayProxyResult {
  if (!statusCode) {
    statusCode = body ? 200 : 204;
  }
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}

export function error(
  message: string,
  statusCode = 400
): AWSLambda.APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify({ message }),
  };
}

export async function catchError(
  handler: () => Promise<AWSLambda.APIGatewayProxyResult>
): Promise<AWSLambda.APIGatewayProxyResult> {
  try {
    return await handler();
  } catch (e) {
    return error("Unexpected error", 500);
  }
}

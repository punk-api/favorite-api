const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};
export function success(
  body?: any,
  statusCode?: number,
  headers = {}
): AWSLambda.APIGatewayProxyResult {
  if (!statusCode) {
    statusCode = body ? 200 : 204;
  }
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: { ...corsHeaders, ...headers },
  };
}

export function error(
  message: string,
  statusCode = 400,
  headers = {}
): AWSLambda.APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify({ message }),
    headers: { ...corsHeaders, ...headers },
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

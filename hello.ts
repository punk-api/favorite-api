import { promisify } from "util";
const timeout = promisify(setTimeout);
const log = (message: string) =>
  console.log(`${new Date().toISOString()}: ${message}`);

if (process.env.IS_OFFLINE === "true") {
  console.debug("This is running offline");
}

export async function handler(
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context
): Promise<AWSLambda.APIGatewayProxyResult> {
  try {
    log(`function hello invoked!`);
    await timeout(1000);
    return {
      statusCode: 200,
      body: JSON.stringify({
        hello: "World!",
        event,
        context,
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: "Something went wrong!"
    };
  }
}

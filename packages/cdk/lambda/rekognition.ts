import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { RekognitionClient, DetectTextCommand } from '@aws-sdk/client-rekognition';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const rekognitionClient = new RekognitionClient({});

    const base64EncodedImage = event.body;
    const imageBytes = Buffer.from(base64EncodedImage, 'base64');

    const rekognitionParams = {
      Image: {
        Bytes: imageBytes,
      },
    };
    const textDetectionResult = await rekognitionClient.send(new DetectTextCommand(rekognitionParams));

    const detectedText = textDetectionResult.TextDetections?.map((detection) => detection.DetectedText) || [];
    return {
      statusCode: 200,
      body: JSON.stringify({ detectedText }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

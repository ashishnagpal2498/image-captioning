import json
import boto3
import jwt
import os
from botocore.exceptions import ClientError

dynamodb = boto3.client('dynamodb')
table_name = 'image-captions'
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'serverless-image-captioning')

def lambda_handler(event, context):
    try:
        # Get the token from the request headers
        token = event['headers'].get('authorization')
        print("Event --->", event)
        if not token:
            raise Exception("Missing token")

        # Decode the JWT token
        try:
            token = token.split(" ")[1]
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            email = decoded_token['email']
        except jwt.ExpiredSignatureError:
            raise Exception("Token expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")

        # Query DynamoDB for images and captions associated with the user
        response = dynamodb.query(
            TableName=table_name,
            KeyConditionExpression='email = :email',
            ExpressionAttributeValues={
                ':email': {'S': email}
            }
        )

        items = [{'imageId': item['imageId']['S'], 'imageURL': item['imageURL']['S'], 'caption': item['caption']['S']} for item in response['Items']]
        
        # Return successful response with images and captions
        response = {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps(items)
        }

    except Exception as e:
        response = {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps({"message": "Error fetching images and captions", "error": str(e)})
        }

    return response

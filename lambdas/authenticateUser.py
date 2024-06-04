import json
import boto3
import jwt
import os
import hashlib
from botocore.exceptions import ClientError

dynamodb = boto3.client('dynamodb')
table_name = 'users'

# Secret key for JWT
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'serverless-image-captioning')

def lambda_handler(event, context):
    try:
        # Decode the base64-encoded body if needed
        if event.get('isBase64Encoded', False):
            body = json.loads(base64.b64decode(event['body']).decode('utf-8'))
        else:
            body = json.loads(event['body'])
            print("Body -->", body)
        # Extract email and password from the request body
        email = body.get('email')
        password = body.get('password')
        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
        # Retrieve user details from DynamoDB
        response = dynamodb.get_item(
            TableName=table_name,
            Key={
                'email': {'S': email}
            }
        )
        
        # Check if user exists
        if 'Item' not in response:
            raise Exception("User not found")

        # Verify password
        stored_password = response['Item']['password']['S']
        if stored_password != hashed_password:
            raise Exception("Incorrect password")

        # Generate JWT token
        token = jwt.encode({'email': email}, SECRET_KEY, algorithm='HS256')

        # Return successful response with JWT token
        response = {
            "statusCode": 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            "body": json.dumps({"token": token})
        }
        print("Response --> ", response)

    except Exception as e:
        response = {
            "statusCode": 400,
            'headers': {
                'Content-Type': 'application/json'
            },
            "body": json.dumps({"message": "Error authenticating user", "error": str(e)})
        }

    return response

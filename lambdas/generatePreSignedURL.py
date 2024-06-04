import json
import boto3
import os
import jwt
from botocore.exceptions import ClientError

s3_client = boto3.client('s3')
bucket_name = os.getenv('S3_BUCKET_NAME', 'serverless-image-captioning-ashish')
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'serverless-image-captioning')

def lambda_handler(event, context):
    try:
        # Parse the request body
        body = json.loads(event['body'])
        file_name = body['fileName']
        file_type = body['fileType']
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

        # Generate a pre-signed URL for the S3 bucket
        response = s3_client.generate_presigned_url('put_object',
            Params={
                'Bucket': bucket_name,
                'Key': file_name,
                'ContentType': file_type,
                'Metadata': {
                    'email': email
                }
            },
            ExpiresIn=3600
        )

        # Return the pre-signed URL
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps({"url": response})
        }

    except Exception as e:
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps({"message": "Error generating pre-signed URL", "error": str(e)})
        }

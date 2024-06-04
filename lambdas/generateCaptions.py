# Generate Captions Lambda Function
import boto3
import os
import json
from datetime import datetime

s3_client = boto3.client('s3')
rekognition_client = boto3.client('rekognition')
dynamodb_client = boto3.client('dynamodb')

DYNAMODB_TABLE = os.getenv('DYNAMODB_TABLE', 'image-captions')

def lambda_handler(event, context):
    try:
        # Logged the event
        print("Event:", event)
        
        # Get the bucket name and key from the S3 event
        bucket_name = event['Records'][0]['s3']['bucket']['name']
        object_key = event['Records'][0]['s3']['object']['key']

        # Get the object metadata (specifically, the email)
        object_metadata = s3_client.head_object(Bucket=bucket_name, Key=object_key)['Metadata']
        email = object_metadata.get('email')

        # Detect labels in the image using Rekognition
        response = rekognition_client.detect_labels(
            Image={
                'S3Object': {
                    'Bucket': bucket_name,
                    'Name': object_key
                }
            },
            MaxLabels=10
        )

        # Generate a caption based on the labels
        labels = [label['Name'] for label in response['Labels']]
        caption = ', '.join(labels)

        # Create a unique imageId (e.g., using the current timestamp)
        image_id = str(datetime.utcnow().timestamp()).replace('.', '')

        # Construct the image URL
        image_url = f"https://{bucket_name}.s3.amazonaws.com/{object_key}"

        # Save the data to DynamoDB
        dynamodb_client.put_item(
            TableName=DYNAMODB_TABLE,
            Item={
                'imageId': {'S': image_id},
                'imageURL': {'S': image_url},
                'caption': {'S': caption},
                'email': {'S': email}
            }
        )
        # Return response to the request
        return {
            'statusCode': 200,
            'body': json.dumps('Image caption generated and saved successfully')
        }

    except Exception as e:
        print("Error:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error generating image caption: {str(e)}")
        }

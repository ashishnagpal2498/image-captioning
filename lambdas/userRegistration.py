import json
import boto3
import hashlib

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')

def lambda_handler(event, context):
    try:
        # Parse the incoming JSON request body
        print("Received event: " + json.dumps(event))
        body = json.loads(event['body'])
        print("body", body)
        first_name = body['firstName']
        last_name = body['lastName']
        phone_number = body['phoneNumber']
        email = body['email']
        password = body['password']

        # Hash the password for security
        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
        
        # Put item in DynamoDB
        table.put_item(
            Item={
                'email': email,
                'firstName': first_name,
                'lastName': last_name,
                'phoneNumber': phone_number,
                'password': hashed_password
            }
        )
        
        # Create response
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'User registered successfully!',
                'redirect': '/login'  # URL where frontend should redirect
            })
        }
        
        return response
    
    except Exception as e:
        # Create error response
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Error registering user',
                'error': str(e)
            })
        }
        
        return response

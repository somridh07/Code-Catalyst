import json
import boto3

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    body = json.loads(event['body'])
    
    # Example: store uploaded data
    s3.put_object(
        Bucket='ai-metadata-bucket',
        Key=f"metadata/{body['filename']}.json",
        Body=json.dumps(body)
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'File metadata stored successfully'})
    }

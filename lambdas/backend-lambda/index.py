import boto3, json

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    rekognition = boto3.client('rekognition')
    comprehend = boto3.client('comprehend')
    
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']

        # Rekognition analysis
        rekog_result = rekognition.detect_labels(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            MaxLabels=5
        )

        # Comprehend example (if text extracted)
        text = "Sample text from OCR or metadata"
        comp_result = comprehend.detect_entities(Text=text, LanguageCode='en')

        # Save results to another bucket
        s3.put_object(
            Bucket='ai-processed-tags',
            Key=f"{key}.json",
            Body=json.dumps({
                "rekognition": rekog_result['Labels'],
                "comprehend": comp_result['Entities']
            })
        )

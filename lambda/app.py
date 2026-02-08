def handler(event, context):
    environmentName = event.get('environmentName', 'dev')
    return {
        "statusCode": 200,
        "body": f"Hello from Alphascout in environment {environmentName}!"
    }

from core.utils import logger

def handler(event, context):
    environmentName = event.get('ENVIRONMENT', 'dev')
    logger.info(f"Handling request for environment: {environmentName}")
    return {
        "statusCode": 200,
        "body": f"Hello from Alphascout in environment {environmentName}!"
    }

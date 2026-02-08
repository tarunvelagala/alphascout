import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { RemovalPolicy, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface AlphaScoutStackProps extends StackProps {
    readonly environmentName: string;
}

export class AlphaScoutStack extends Stack {
    constructor(scope: Construct, id: string, props: AlphaScoutStackProps) {
        super(scope, id, props);

        // Tag all resources for cost allocation & environment
        Tags.of(this).add('Project', 'AlphaScout');
        Tags.of(this).add('Environment', props.environmentName);

        // You can add more resources here, e.g. Lambda, DynamoDB, etc.
        const alphaScoutLambda = new PythonFunction(this, `AlphaScoutLambda-${props.environmentName}`, {
            entry: '../lambda', // folder with your Python code
            index: 'app.py', // file containing the handler
            handler: 'handler', // function name inside app.py
            runtime: Runtime.PYTHON_3_10,
            functionName: `AlphaScoutLambda-${props.environmentName}`,
            environment: {
                ENVIRONMENT: props.environmentName,
                LOG_LEVEL: 'INFO',
            },
            logGroup: new LogGroup(this, `AlphaScoutLambdaLogGroup-${props.environmentName}`, {
                logGroupName: `/aws/lambda/AlphaScoutLambda-${props.environmentName}`,
                retention: RetentionDays.ONE_MONTH,
                removalPolicy: RemovalPolicy.DESTROY,
            }),
        });
    }
}

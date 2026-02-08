import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class AlphaScoutStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // You can add more resources here, e.g. Lambda, DynamoDB, etc.
        const alphaScoutLambda = new PythonFunction(this, 'AlphaScoutLambda', {
            entry: '../lambda', // folder with your Python code
            index: 'app.py', // file containing the handler
            handler: 'handler', // function name inside app.py
            runtime: Runtime.PYTHON_3_10,
            environment: {},
        });
    }
}

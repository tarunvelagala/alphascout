import { Template, Match } from 'aws-cdk-lib/assertions';
import { AlphaScoutStack } from '../infrastructure/alpha-scout-stack';
import * as cdk from 'aws-cdk-lib';

describe('AlphaScoutStack', () => {
  let app: cdk.App;
  let stack: AlphaScoutStack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    stack = new AlphaScoutStack(app, 'TestAlphaScoutStack', {
      environmentName: 'test',
      env: { account: '123456789012', region: 'ap-south-1' },
    });
    template = Template.fromStack(stack);
  });

  test('creates a Lambda function', () => {
    template.resourceCountIs('AWS::Lambda::Function', 1);
  });

  test('lambda uses Python 3.10 runtime', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'python3.10',
    });
  });

  test('lambda handler matches PythonFunction convention', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      // PythonFunction automatically sets handler as '{index}.{handler}'
      Handler: 'app.handler',
    });
  });

  test('lambda code is packaged as an asset', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Code: {
        S3Key: Match.anyValue(),
      },
    });
  });

  test('lambda has correct environment variables', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          ENVIRONMENT: 'test',
        },
      },
    });
  });
});

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
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'python3.10',
      Handler: 'app.handler',
      Environment: {
        Variables: {
          ENVIRONMENT: 'test',
          LOG_LEVEL: 'INFO',
        },
      },
    });
  });

  test('lambda uses Python 3.10 runtime', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'python3.10',
    });
  });

  test('lambda has correct function name', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: 'AlphaScoutLambda-test',
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

  // LogGroup Tests
  test('LogGroup exists with correct retention', () => {
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: Match.anyValue(), // avoid matching Fn::Join
      RetentionInDays: 30,
    });
  });

  test('LogGroup has removal policy destroy', () => {
    const logGroups = template.findResources('AWS::Logs::LogGroup', {});
    const logGroupKey = Object.keys(logGroups).find((k) => logGroups[k].Type === 'AWS::Logs::LogGroup');
    expect(logGroupKey).toBeDefined();
    if (logGroupKey) {
      expect(logGroups[logGroupKey].DeletionPolicy).toBe('Delete');
      expect(logGroups[logGroupKey].UpdateReplacePolicy).toBe('Delete');
    }
  });
});

import { Template, Match } from 'aws-cdk-lib/assertions';
import { AlphaScoutStack } from '../lib/alpha-scout-stack';
import { App } from 'aws-cdk-lib/core';

describe('AlphaScoutStack', () => {
  let app: App;
  let stack: AlphaScoutStack;
  let template: Template;

  beforeAll(() => {
    app = new App();
    stack = new AlphaScoutStack(app, 'TestAlphaScoutStack');
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

  test('lambda handler is correct', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'handler.lambda_handler',
    });
  });

  test('lambda code is packaged as an asset', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Code: {
        S3Bucket: Match.anyValue(),
        S3Key: Match.anyValue(),
      },
    });
  });
});

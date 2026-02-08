import { Template, Match } from 'aws-cdk-lib/assertions';
import { AlphaScoutStack } from '../infrastructure/alpha-scout-stack';
import { App } from 'aws-cdk-lib';

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

  test('lambda handler matches PythonFunction convention', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      // PythonFunction automatically sets handler as 'app.handler'
      Handler: 'app.handler',
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

  test('lambda has no environment variables by default', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: Match.absent(),
    });
  });
});

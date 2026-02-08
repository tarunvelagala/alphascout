#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AlphaScoutStack } from '../infrastructure/alpha-scout-stack';
import { envMap } from '../infrastructure/env-config';

const envName = process.env.ENVIRONMENT || 'dev';

// Validate environment exists
if (!envMap[envName]) {
  throw new Error(`Unknown environment '${envName}'. Valid options: ${Object.keys(envMap).join(', ')}`);
}

const app = new cdk.App();

const stackName = `AlphaScoutStack-${envName}`;

new AlphaScoutStack(app, stackName, {
  environmentName: envName,
  env: envMap[envName],
});

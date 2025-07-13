import { S3Client } from "@aws-sdk/client-s3";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { commonAwsCredConfig } from "./awsConfig.js";

export const s3Client = new S3Client(commonAwsCredConfig);

export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION,
});

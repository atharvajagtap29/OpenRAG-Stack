// Configure AWS Credentials Object which I will use for services clients
import "../../config/config.js";

export const commonAwsCredConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

import * as AWS from "aws-sdk";

interface EmailInfo {
  recipient: string;
  subject: string;
  body: string;
}

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (typeof value === 'undefined') {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const sendEmail = (
  info: EmailInfo
): Promise<AWS.AWSError | AWS.SES.SendEmailResponse> => {
  const ses = new AWS.SES({
    apiVersion: "latest",
    region: getEnvVar('AWS_REGION'),
    credentials: {
      accessKeyId: getEnvVar('ACCESS_KEY_ID'),
      secretAccessKey: getEnvVar('ACCESS_SECRET'),
    },
  });

  return new Promise((res, rej) => {
    ses.sendEmail(
      {
        Source: getEnvVar('SENDER_EMAIL'),
        Destination: {
          ToAddresses: [info.recipient],
        },
        Message: {
          Subject: {
            Data: info.subject,
          },
          Body: {
            Html: {
              Data: info.body,
            },
          },
        },
      },
      (e: AWS.AWSError, response: AWS.SES.SendEmailResponse) => {
        if (e) {
          rej(e);
        } else {
          res(response);
        }
      }
    );
  });
};

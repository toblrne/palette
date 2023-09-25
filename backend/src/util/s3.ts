import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

interface ImageInfo {
  fileName: string;
  fileType: string;
}

interface SignedUrlResult {
  signedUrl: string;
  url: string;
}

export const getSignedUrl = async (info: ImageInfo): Promise<SignedUrlResult> => {
  const fileName = `images/${Math.random().toString(36).substring(2, 15)}-${Date.now()}-${info.fileName}`;
  const params = {
    Bucket: process.env.BUCKET_NAME as string,
    Key: fileName,
    ACL: "public-read",
    ContentType: info.fileType,
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise("putObject", params);
    const url = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    return { signedUrl, url };
  } catch (e) {
    throw new Error(`Error getting presigned URL: ${(e as Error).message}`);
  }
};

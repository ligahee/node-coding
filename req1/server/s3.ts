import S3 from 'aws-sdk/clients/s3'

const s3: S3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESSIDKEY,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  signatureVersion: 'v4'
})

export const generateUploadUrl = async (photoName: string): Promise<string> => {

  const params = {
    Bucket: 'jiayili7413',
    Key: photoName,
  }

  const url: string = await s3.getSignedUrlPromise('putObject', params)

  return url;
}
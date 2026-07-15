import { Client } from 'minio';

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: Number(process.env.MINIO_PORT || 9000),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!
});

export const BUCKETS = {
  originals: process.env.MINIO_BUCKET_ORIGINALS || 'veedibox-originals',
  previews: process.env.MINIO_BUCKET_PREVIEWS || 'veedibox-previews'
};

export async function getUploadUrl(bucket: string, objectKey: string, expirySeconds = 900) {
  return minioClient.presignedPutObject(bucket, objectKey, expirySeconds);
}

export async function getDownloadUrl(bucket: string, objectKey: string, expirySeconds = 300) {
  return minioClient.presignedGetObject(bucket, objectKey, expirySeconds);
}

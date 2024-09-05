import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { fileTypeFromBuffer } from "file-type";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Upload } from '@aws-sdk/lib-storage';


// Ensure the AWS_REGION environment variable is correctly set
const region = process.env.AWS_REGION;


// Create credentials object
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
};

// Create an S3 client using environment credentials and specifying the correct endpoint
const s3Client = new S3Client({
  region: region,
  credentials: credentials,
});

interface UploadParams {
  Folder: string;
  file: string; // Base64 encoded file content
}

export const uploadFile = async ({ Folder, file }: UploadParams) => {
  
  try {
    const fileBuffer = Buffer.from(file, "base64");

    // Determine file type using file-type library
    const fileType = await fileTypeFromBuffer(fileBuffer);

    if (!fileType) {
      throw new Error("Unable to determine file type");
    }
    const fileName = `${uuidv4()}.${fileType.ext}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${Folder}/${Date.now()}_${fileName}`, // File name you want to save as in S3
      Body: fileBuffer,
      ContentEncoding: "base64", // required if file is base64 encoded
      ContentType: fileType.mime, // Use fileType.mime for ContentType
    };
    const upload = new Upload({
      client: s3Client,
      params: params,
    });
    const data = await upload.done();

    const url:string = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${params.Key}`;

    return { success: true, data, url };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error };
  }
};


export const getParam = (url: string) => {
  const { pathname } = new URL(url);
  const args = pathname.split("/");
  const value = args.length - 1;
  return args[value];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/formatCurrency.js
export const formatCurrency = (value:number, currency = 'TZS', locale = 'en-US') => {
  if (value == null || isNaN(value)) {
    return '';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};


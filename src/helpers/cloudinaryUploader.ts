import cloudinary from 'config/cloudinary.config';
import { Request } from 'express';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

const uploadFromBuffer = (req: Request, destination: string, height: number): Promise<string> =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: destination,
        quality: 'auto',
        fetch_format: 'auto',
        width: 'auto',
        allowed_formats: ['jpeg', 'jpg', '.jfif', '.pjpeg', '.pjp', 'png', 'svg', 'webp'],
        height
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    uploadStream.on('error', err => {
      reject(err);
    });
    req.pipe(uploadStream);
  });

export { uploadFromBuffer };

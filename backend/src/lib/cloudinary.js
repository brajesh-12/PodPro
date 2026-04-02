import { v2 as cloudinary} from 'cloudinary';
import ENV from './env.js';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUDNAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'PodPro_uploads' },
      (error, result) => {
        if(result) resolve(result);
        else reject(error);
      }
    );

    Readable.from(fileBuffer).pipe(stream);
  });
};

export default cloudinary;
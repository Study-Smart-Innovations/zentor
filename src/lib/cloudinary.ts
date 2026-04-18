import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Resizes and uploads an image to Cloudinary.
 * @param buffer The image buffer
 * @param folder The folder name in Cloudinary
 * @param width The target width (default 1280)
 * @param height The target height (default 720)
 * @returns The Cloudinary upload result
 */
export async function uploadOptimizedImage(
  buffer: Buffer,
  folder: string = 'course-banners',
  width: number = 1280,
  height: number = 720
) {
  try {
    // 1. Scale down and optimize image using sharp
    const optimizedBuffer = await sharp(buffer)
      .resize(width, height, {
        fit: 'cover',
        withoutEnlargement: true,
      })
      .toFormat('webp') // Convert to webp for better performance
      .toBuffer();

    // 2. Upload to Cloudinary using a promise to handle the stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      uploadStream.end(optimizedBuffer);
    });
  } catch (error) {
    console.error('[Cloudinary] Optimization/Upload Error:', error);
    throw error;
  }
}

/**
 * Deletes an image from Cloudinary using its public ID.
 * @param publicId The public ID of the image
 * @returns The Cloudinary deletion result
 */
export async function deleteCloudinaryImage(publicId: string) {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('[Cloudinary] Deletion Error:', error);
    throw error;
  }
}

/**
 * Utility to extract a public ID from a Cloudinary URL.
 * Assumes format: .../upload/v12345/folder/id.ext
 * @param url The full Cloudinary secure URL
 * @returns The public ID or null if extraction fails
 */
export function extractPublicId(url: string | null): string | null {
  if (!url) return null;
  
  try {
    // Split by /upload/ to isolate the version and path
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    // Remove version (v1234567890/) and extension (.webp)
    const remainingPath = parts[1].split('/').slice(1).join('/');
    const publicId = remainingPath.split('.')[0];
    
    return publicId;
  } catch (error) {
    console.error('[Cloudinary] Public ID Extraction Error:', error);
    return null;
  }
}

export default cloudinary;

// Cloudinary unsigned upload helper
// Uses Cloudinary's free tier (25 credits/month = ~25 GB storage + bandwidth)
// No SDK needed — just a simple fetch to their upload API

const CLOUD_NAME = "dmcbxrmmt";
const UPLOAD_PRESET = "campus_exchange";

/**
 * Upload a single image file to Cloudinary (unsigned upload).
 * Returns the secure URL of the uploaded image.
 */
export async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "campus-exchange/listings");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error?.message || "Image upload failed");
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * Upload multiple image files to Cloudinary.
 * Returns an array of secure URLs.
 */
export async function uploadMultipleImages(files) {
  const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
  return Promise.all(uploadPromises);
}

import e from "express";

function updateImages(
  images: string[] | null,
  newImages: string[] | null,
  deleteImages: string[] | null
): string[] {
  // Start with existing images or an empty array
  let updatedImages = images ? [...images] : [];

  // Remove images if deleteImages is provided
  if (deleteImages && deleteImages.length > 0) {
    updatedImages = updatedImages.filter((img) => !deleteImages.includes(img));
  }

  // Add new images if newImages is provided
  if (newImages && newImages.length > 0) {
    updatedImages = [...updatedImages, ...newImages];
  }

  return updatedImages;
}

// // Example usage:
// const images = ["image1.png", "image2.png", "image3.png", "image4.png", "image5.png"];
// const newImages = ["image6.png", "image7.png", "image8.png"];
// const deleteImages = ["image3.png", "image4.png"];

// Output: ["image1.png", "image2.png", "image5.png", "image6.png", "image7.png", "image8.png"]
export default updateImages;

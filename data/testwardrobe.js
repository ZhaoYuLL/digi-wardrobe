import { wardrobe } from "../config/mongoCollections.js";

export const getAllOutfits = async () => {
  const wardrobeCollection = await wardrobe();

  // Find all documents in the outfitPieces collection
  const images = await wardrobeCollection.find({}).toArray();

  console.log(`Found ${images.length} wardrobes`);
  return images;
};
export const storeWardrobe = async (id, wardrobeName, fitposts, username) => {
  const wardrobeCollection = await wardrobe();

  // Create a new document with the provided caption and imageName
  const newImage = {
    _id: id,
    wardrobeName,
    fitposts,
    username,
  };

  // Insert the new document into the outfitPieces collection
  const result = await wardrobeCollection.insertOne(newImage);

  // Check if the insertion was successful
  if (result.insertedId) {
    // console.log("Image stored successfully");
    return result.insertedId;
  } else {
    throw new Error("Failed to store image");
  }
};

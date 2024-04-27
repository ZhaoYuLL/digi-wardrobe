import { test } from "../config/mongoCollections.js";

export const getAllOutfits = async () => {
	const outfitPiecesCollection = await test();

	// Find all documents in the outfitPieces collection
	const images = await outfitPiecesCollection.find({}).toArray();

	console.log(`Found ${images.length} images`);
	return images;
};
export const storeImage = async (caption, imageName, outfit, fitposts) => {
	const outfitPiecesCollection = await test();

	// Create a new document with the provided caption and imageName
	const newImage = {
		caption: caption,
		imageName: imageName,
		outfit,
		fitposts,
	};

	// Insert the new document into the outfitPieces collection
	const result = await outfitPiecesCollection.insertOne(newImage);

	// Check if the insertion was successful
	if (result.insertedId) {
		// console.log("Image stored successfully");
		return result.insertedId;
	} else {
		throw new Error("Failed to store image");
	}
};

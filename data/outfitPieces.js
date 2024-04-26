import { outfitPieces } from "../config/mongoCollections.js";
// import { outfitPieces } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const storeImage = async (caption, imageName) => {
	const outfitPiecesCollection = await outfitPieces();

	// Create a new document with the provided caption and imageName
	const newImage = {
		caption: caption,
		imageName: imageName,
	};

	// Insert the new document into the outfitPieces collection
	const result = await outfitPiecesCollection.insertOne(newImage);

	// Check if the insertion was successful
	if (result.insertedId) {
		console.log("Image stored successfully");
		return result.insertedId;
	} else {
		throw new Error("Failed to store image");
	}
};

export const getImage = async (imageName) => {
	const outfitPiecesCollection = await outfitPieces();

	// Find the document with the provided imageName
	const image = await outfitPiecesCollection.findOne({
		imageName: imageName,
	});

	// Check if the image exists
	if (image) {
		console.log("Image found");
		return image;
	} else {
		throw new Error("Image not found");
	}
};

export const getAllImages = async () => {
	const outfitPiecesCollection = await outfitPieces();

	// Find all documents in the outfitPieces collection
	const images = await outfitPiecesCollection.find({}).toArray();

	console.log(`Found ${images.length} images`);
	return images;
};

export const deleteImage = async (imageName) => {
	const outfitPiecesCollection = await outfitPieces();
	await outfitPiecesCollection.deleteOne({ imageName: imageName });
};

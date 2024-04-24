import { fitposts } from "../config/mongoCollections.js";

export const storeImage = async (caption, imageName) => {
	const fitpostsCollection = await fitposts();

	// Create a new document with the provided caption and imageName
	const newImage = {
		caption: caption,
		imageName: imageName,
	};

	// Insert the new document into the fitposts collection
	const result = await fitpostsCollection.insertOne(newImage);

	// Check if the insertion was successful
	if (result.insertedId) {
		console.log("Image stored successfully");
		return result.insertedId;
	} else {
		throw new Error("Failed to store image");
	}
};

export const getImage = async (imageName) => {
	const fitpostsCollection = await fitposts();

	// Find the document with the provided imageName
	const image = await fitpostsCollection.findOne({ imageName: imageName });

	// Check if the image exists
	if (image) {
		console.log("Image found");
		return image;
	} else {
		throw new Error("Image not found");
	}
};

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
// import { storeImage } from "../data/outfitPieces.js";
import { generateFileName } from "../helper.js";
import { test } from "../config/mongoCollections.js";

const db = await dbConnection();
await db.dropDatabase();
//leave top alone

export const storeImage = async (caption, imageName, outfit) => {
	const outfitPiecesCollection = await test();

	// Create a new document with the provided caption and imageName
	const newImage = {
		caption: caption,
		imageName: imageName,
		outfit,
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
export const getAllImages = async () => {
	const outfitPiecesCollection = await test();

	// Find all documents in the outfitPieces collection
	const images = await outfitPiecesCollection.find({}).toArray();

	console.log(`Found ${images.length} images`);
	return images;
};
// await generateFileName()
const str = "785b7cb8b53d08232c89c88f06a7ad0c7e59acaeccc85119665c4775c73f127e";
const str2 = "785b7cb8b53d08232c89c88f06a7ad0c7e59acaeccc85119665c4775c73f127f";

await storeImage("cat", str, "headwear");
await storeImage("dog", str2, "legwear");

//leave bottom alone
console.log("Done seeding database");
await closeConnection();

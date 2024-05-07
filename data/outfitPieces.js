import { outfitPieces } from "../config/mongoCollections.js";
// import { outfitPieces } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { getUserByUsername } from "./users.js";

export const storeImage = async (
	caption,
	link,
	outfitType,
	imageName,
	username
) => {
	const outfitPiecesCollection = await outfitPieces();

	// Create a new document with the provided caption and imageName
	const newImage = {
		caption,
		link,
		outfitType,
		imageName: imageName,
		username,
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

export const getImage = async (imageName) => {
	const outfitPiecesCollection = await outfitPieces();

	// Find the document with the provided imageName
	const image = await outfitPiecesCollection.findOne({
		imageName: imageName,
	});

	// Check if the image exists
	if (image) {
		//console.log("Image found");
		return image;
	} else {
		throw new Error("Image not found");
	}
};

export const getImageById = async (id) => {
	const outfitPiecesCollection = await outfitPieces();

	// Find the document with the provided imageName
	const image = await outfitPiecesCollection.findOne({
		_id: new ObjectId(id),
	});

	// Check if the image exists
	if (image) {
		//console.log("Image found");
		return image;
	} else {
		throw new Error("Image not found");
	}
};

export const getAllImages = async () => {
	const outfitPiecesCollection = await outfitPieces();

	// Find all documents in the outfitPieces collection
	const images = await outfitPiecesCollection.find({}).toArray();

	// console.log(`Found ${images.length} images`);
	return images;
};
//console.log(await getImage("435c29542cc36cbfc5bb32b578915f0585917c83c333c27655deb5411ecefc4f"));

export const deleteImage = async (imageName) => {
	const outfitPiecesCollection = await outfitPieces();
	const deletionInfo = await getImage(imageName);
	await outfitPiecesCollection.findOneAndDelete({ imageName: imageName });

	return deletionInfo;
};


export const getOutfitPiecesByUsername = async (username) => {
	// get all outfit pieces owned by user
	const outfitPiecesCollection = await outfitPieces();
	const userOutfitPieces = outfitPiecesCollection.find({ username: username }).toArray();
	if (!userOutfitPieces) throw new Error(`Error getting outfit pieces for user ${username}`);

	return userOutfitPieces;
};

export const getAllFromCloset = async (username) => {
	// get all of the outfit pieces from ur closet
	let user = await getUserByUsername(username);
	let closet = user.closet;
	let closetOutfitPieces = [];

	for (let i = 0; i < closet.length; i++) {
		let outfitPiece = await getImageById(closet[i]);
		closetOutfitPieces.push(outfitPiece);
	}

	return closetOutfitPieces;
}

import { fitposts } from "../config/mongoCollections.js";
import { MongoClient, GridFSBucket } from "mongodb";
const fitpostCollection = await fitposts();

// Upload an image
const uploadImage = async (imagePath, filename, metadata) => {
	return new Promise((resolve, reject) => {
		const imageStream = fs.createReadStream(imagePath);
		const uploadStream = bucket.openUploadStream(filename, {
			contentType: "image/jpeg",
			metadata: metadata,
		});

		imageStream
			.pipe(uploadStream)
			.on("error", (error) => {
				reject(error);
			})
			.on("finish", () => {
				resolve(uploadStream.id);
			});
	});
};

// Retrieve an image
const getImage = async (fileId) => {
	return new Promise((resolve, reject) => {
		const downloadStream = bucket.openDownloadStream(fileId);
		const chunks = [];

		downloadStream.on("data", (chunk) => {
			chunks.push(chunk);
		});

		downloadStream.on("error", (error) => {
			reject(error);
		});

		downloadStream.on("end", () => {
			const imageBuffer = Buffer.concat(chunks);
			resolve(imageBuffer);
		});
	});
};

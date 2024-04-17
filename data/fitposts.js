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

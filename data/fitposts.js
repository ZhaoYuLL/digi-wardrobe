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

try {
	// Upload an image
	const imagePath = "path/to/image.jpg";
	const filename = "image.jpg";
	const metadata = { description: "My image" };
	const fileId = await uploadImage(imagePath, filename, metadata);
	console.log("Image uploaded successfully. File ID:", fileId);

	// Retrieve the uploaded image
	const imageBuffer = await getImage(fileId);
	console.log(
		"Image retrieved successfully. Buffer size:",
		imageBuffer.length
	);

	// You can now save the fileId in your fitpost document
	const fitpost = {
		// ... other fitpost fields
		image: fileId,
	};
	await fitpostCollection.insertOne(fitpost);
} catch (error) {
	console.error("Error:", error);
}

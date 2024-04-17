import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {
	initializeBucket,
	uploadImage,
	getFitpostCollection,
} from "./fitposts.js";
import { fitposts } from "../config/mongoCollections.js";

const db = await dbConnection();
const fitpostCollection = await fitposts();

initializeBucket(db);

// Seed the database
try {
	await db.dropDatabase();

	// Upload an image to GridFS
	const imagePath = "path/to/image.jpg"; // Replace with the actual path to your image file
	const fileId = await uploadImage(imagePath);

	// Create a fitpost document with the image reference
	const fitpost = {
		// ... other fitpost fields
		image: fileId,
	};
	await fitpostCollection.insertOne(fitpost);

	console.log("Done seeding database");
} catch (error) {
	console.error("Error seeding database:", error);
} finally {
	await closeConnection();
}

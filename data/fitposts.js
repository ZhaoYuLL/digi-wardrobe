import { fitposts } from "../config/mongoCollections.js";
//initial branch commit
import { GridFSBucket } from "mongodb";
import fs from "fs";
import path from "path";

let bucket;

export const initializeBucket = (db) => {
	bucket = new GridFSBucket(db);
};

export const uploadImage = async (imagePath) => {
	return new Promise((resolve, reject) => {
		const filename = path.basename(imagePath);
		const uploadStream = bucket.openUploadStream(filename, {
			contentType: "image/jpeg", // Adjust the content type based on your image format
			metadata: {
				/* Additional metadata */
			},
		});

		fs.createReadStream(imagePath)
			.pipe(uploadStream)
			.on("error", (error) => {
				reject(error);
			})
			.on("finish", () => {
				resolve(uploadStream.id);
			});
	});
};

export const getFitpostCollection = (db) => {
	return db.collection("fitposts");
};
import { GridFSBucket } from "mongodb";
import fs from "fs";
import path from "path";

let bucket;

export const initializeBucket = (db) => {
	bucket = new GridFSBucket(db);
};

export const uploadImage = async (imagePath) => {
	return new Promise((resolve, reject) => {
		const filename = path.basename(imagePath);
		const uploadStream = bucket.openUploadStream(filename, {
			contentType: "image/jpeg", // Adjust the content type based on your image format
			metadata: {
				/* Additional metadata */
			},
		});

		fs.createReadStream(imagePath)
			.pipe(uploadStream)
			.on("error", (error) => {
				reject(error);
			})
			.on("finish", () => {
				resolve(uploadStream.id);
			});
	});
};

export const getFitpostCollection = (db) => {
	return db.collection("fitposts");
};

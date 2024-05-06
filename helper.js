import multer from "multer";
import sharp from "sharp";
import dotenv from "dotenv";
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import {
	storeImage,
	getImage,
	getAllImages,
	deleteImage,
} from "./data/outfitPieces.js";

export const validString = (input) => {
	if (typeof input !== "string" || !input) {
		throw `${input || "Provided variable"} is not a string`;
	} else {
		let inputTrim = input.trim();
		if (inputTrim.length === 0) {
			throw "Provided variable is not a string";
		}
		return inputTrim;
	}
};

const imageExists = async (imageName) => {
	// checks if the image exists in the database
	// this is for when a fitpost has a deleted outfit piece in it
	try {
		const post = await getImage(imageName);
	} catch (e) {
		return false;
	}
	return true;
}

//!start outfitpeices

//secure way of accessing secret key
dotenv.config();

const BUCKET_NAME = process.env.BUCKET_NAME1;
const BUCKET_REGION = process.env.BUCKET_REGION1;
const ACCESS_KEY = process.env.ACCESS_KEY1;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY1;

export const s3 = new S3Client({
	credentials: {
		accessKeyId: ACCESS_KEY,
		secretAccessKey: SECRET_ACCESS_KEY,
	},
	region: BUCKET_REGION,
});
//generate a random file name to store in s3 bucket 32 chars,
export const generateFileName = async (bytes = 32) => {
	const { randomBytes } = await import("node:crypto");
	return new Promise((resolve, reject) => {
		randomBytes(bytes, (err, buf) => {
			if (err) {
				reject(err);
			} else {
				resolve(buf.toString("hex"));
			}
		});
	});
};

//creating an url that display the images in s3 bucket, appends to 'posts'
export const addSignedUrlsToPosts = async () => {
	try {
		// Get all posts from the database
		const posts = await getAllImages();
		// console.log(posts);
		// Loop through each post and generate a signed URL for the image
		for (let post of posts) {
			const imageName = post.imageName;
			// Generate a signed URL for the image
			const signedUrl = await getSignedUrl(
				s3,
				new GetObjectCommand({
					Bucket: BUCKET_NAME,
					Key: imageName,
				}),
				{ expiresIn: 6000 } // 6000 seconds
			);

			// Add the signed URL to the post object
			post.imageUrl = signedUrl;
			// console.log("image url:", post.imageUrl);
		}

		// console.log("Signed URLs added to posts");
		return posts;
	} catch (error) {
		console.error("Error adding signed URLs to posts:", error);
		throw error;
	}
};

export const addSignedUrlsToOutfitPieces = async (posts) => {
	try {
		// console.log(posts);
		// Loop through each post and generate a signed URL for the image
		for (let post of posts) {
			const imageName = post.imageName;
			// Generate a signed URL for the image
			const signedUrl = await getSignedUrl(
				s3,
				new GetObjectCommand({
					Bucket: BUCKET_NAME,
					Key: imageName,
				}),
				{ expiresIn: 6000 } // 6000 seconds
			);
			//console.log(signedUrl);
			// Add the signed URL to the post object
			post.imageUrl = signedUrl;
			// console.log("image url:", post.imageUrl);
		}

		// console.log("Signed URLs added to posts");
		return posts;
	} catch (error) {
		console.error("Error adding signed URLs to posts:", error);
		throw error;
	}
};

const addUrl = async (imgName) => {
	return await getSignedUrl(
		s3,
		new GetObjectCommand({
			Bucket: BUCKET_NAME,
			Key: imgName,
		}),
		{ expiresIn: 6000 } // 6000 seconds
	);
};
export const addSignedUrlsToFitPosts_in_wardrobe = async (outfits) => {
	try {
		// Loop through each outfit and generate signed URLs for the fitposts
		for (let outfit of outfits) {
			for (let fitpost of outfit.fitposts) {
				let headName = fitpost.headwear;
				let bodyName = fitpost.bodywear;
				let legName = fitpost.legwear;
				let footName = fitpost.footwear;

				// checks if the outfit pieces still exist in the database
				let headUrl, bodyUrl, legUrl, footUrl;
				if (await imageExists(headName)) {
					headUrl = await addUrl(headName);
				}
				else headUrl = "/public/no_image.jpg";

				if (await imageExists(bodyName)) {
					bodyUrl = await addUrl(bodyName);
				}
				else bodyUrl = "/public/no_image.jpg";

				if (await imageExists(legName)) {
					legUrl = await addUrl(legName);
				}
				else legUrl = "/public/no_image.jpg";

				if (await imageExists(footName)) {
					footUrl = await addUrl(footName);
				}
				else footUrl = "/public/no_image.jpg";

				fitpost.headUrl = headUrl;
				fitpost.bodyUrl = bodyUrl;
				fitpost.legUrl = legUrl;
				fitpost.footUrl = footUrl;
			}
		}
		return outfits;
	} catch (error) {
		console.error("Error adding signed URLs to posts:", error);
		throw error;
	}
};


export const addSignedUrlsToFitPosts_in_fitposts = async (outfits) => {
	try {
		// Loop through each outfit and generate signed URLs for the fitposts
		for (let fitpost of outfits) {

			let headName = fitpost.headwear;
			let bodyName = fitpost.bodywear;
			let legName = fitpost.legwear;
			let footName = fitpost.footwear;

			// checks if the outfit pieces still exist in the database
			let headUrl, bodyUrl, legUrl, footUrl;
			if (await imageExists(headName)) {
				headUrl = await addUrl(headName);
			}
			else headUrl = "/public/no_image.jpg";

			if (await imageExists(bodyName)) {
				bodyUrl = await addUrl(bodyName);
			}
			else bodyUrl = "/public/no_image.jpg";

			if (await imageExists(legName)) {
				legUrl = await addUrl(legName);
			}
			else legUrl = "/public/no_image.jpg";

			if (await imageExists(footName)) {
				footUrl = await addUrl(footName);
			}
			else footUrl = "/public/no_image.jpg";

			fitpost.headUrl = headUrl;
			fitpost.bodyUrl = bodyUrl;
			fitpost.legUrl = legUrl;
			fitpost.footUrl = footUrl;

		}
		return outfits;
	} catch (error) {
		console.error("Error adding signed URLs to posts:", error);
		throw error;
	}
};
export const addSignedUrlsToFitPosts_in_closet = async (outfits) => {
	try {
		// Loop through each outfit and generate signed URLs for the fitposts
		for (let outfit of outfits) {
			let imageName = outfit.imageName;
			outfit.imageUrl = await addUrl(imageName);
		}
		return outfits;
	} catch (error) {
		console.error("Error adding signed URLs to posts:", error);
		throw error;
	}
};
export const uploadImageToS3 = async (file, h, w, imageName) => {
	try {
		// Resize image using sharp package
		// const fileBuffer = await sharp(file.buffer)
		// 	.resize({ height: h, width: w, fit: "contain" })
		// 	.toBuffer();
		const fileBuffer = file.buffer;

		// Set up params that s3 bucket will need to access
		const params = {
			Bucket: BUCKET_NAME,
			Key: imageName,
			Body: fileBuffer,
			ContentType: file.mimetype,
		};

		// Send image to s3 bucket
		const command = new PutObjectCommand(params);
		await s3.send(command);

		return imageName;
	} catch (error) {
		console.error("Error uploading image to S3:", error);
		throw error;
	}
};

export const deleteImageFromS3 = async (s3_image_name) => {
	try {
		// Find the post by imageName in the MongoDB database
		const post = await getImage(s3_image_name);

		if (!post) {
			throw new Error("Post not found");
		}

		// Set up params needed for deleting the image from S3
		const deleteParams = {
			Bucket: BUCKET_NAME,
			Key: s3_image_name,
		};

		// Delete image from S3
		await s3.send(new DeleteObjectCommand(deleteParams));

		// Delete the post from the MongoDB database
		await deleteImage(s3_image_name);
	} catch (error) {
		console.error("Error deleting image from S3:", error);
		throw error;
	}
};

// takes a fitpost, returns the stringified date
export const convertDate = (fitpost) => {
	const dateValue = fitpost.postedDate;

	const date = new Date(dateValue);
	const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
	return formattedDate;
}
//!end outfit pieces

//!please do export const instead of this export {...func names}
// export { validString };

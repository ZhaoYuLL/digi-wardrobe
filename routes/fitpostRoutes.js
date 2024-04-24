import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import dotenv from "dotenv";
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
	storeImage,
	getImage,
	getAllImages,
	deleteImage,
} from "../data/fitposts.js";
const router = Router();

dotenv.config();

//secure way of accessing secret key
const BUCKET_NAME = process.env.BUCKET_NAME1;
const BUCKET_REGION = process.env.BUCKET_REGION1;
const ACCESS_KEY = process.env.ACCESS_KEY1;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY1;

const generateFileName = async (bytes = 32) => {
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

const s3 = new S3Client({
	credentials: {
		accessKeyId: ACCESS_KEY,
		secretAccessKey: SECRET_ACCESS_KEY,
	},
	region: BUCKET_REGION,
});

const addSignedUrlsToPosts = async () => {
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
				{ expiresIn: 60 } // 60 seconds
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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//! since i appended to /fitpost in index.js, i simply start with "/" here in fitpost routes
router
	.route("/")
	.get(async (req, res) => {
		// addSignedUrlsToPosts;
		try {
			// console.log("yo");
			const postsUrls = await addSignedUrlsToPosts();
			// console.log("");
			res.render("fitposts", { title: "fitposts", posts: postsUrls });
			// res.render("fitposts");
		} catch (error) {
			console.error("Error rendering fitposts:", error);
			res.status(500).send("Internal Server Error");
		}
	})
	.post(upload.single("image"), async (req, res) => {
		//resize image
		const fileBuffer = await sharp(req.file.buffer)
			.resize({ height: 1920, width: 1080, fit: "contain" })
			.toBuffer();
		//give image its name
		const imageName = await generateFileName();
		const params = {
			Bucket: BUCKET_NAME,
			Key: imageName,
			Body: fileBuffer,
			ContentType: req.file.mimetype,
		};
		const command = new PutObjectCommand(params);
		await s3.send(command);

		//storing image in mongo
		const post = await storeImage(req.body.caption, imageName);
		res.render("fitposts", { title: "fitposts" });
	});
router.route("/:imageName").delete(async (req, res) => {
	console.log("you're in");
	try {
		const postId = req.params.imageName;

		// Find the post by ID in the database
		const post = await getImage(postId);

		if (!post) {
			return res.status(404).send("Post not found");
		}

		// Delete the image from S3
		const deleteParams = {
			Bucket: BUCKET_NAME,
			Key: postId,
		};

		await s3.send(new DeleteObjectCommand(deleteParams));

		// Delete the post from the database
		await deleteImage(postId);

		res.send("Post deleted successfully");
	} catch (error) {
		console.error("Error deleting post:", error);
		res.status(500).send("Internal Server Error");
	}
});

export default router;

import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { storeImage, getImage, getAllImages } from "../data/fitposts.js";
const router = Router();

//not_secure
const BUCKET_NAME = "digidrobe";
const BUCKET_REGION = "us-east-2";
const ACCESS_KEY = "AKIA2UC3EQYTZS4TLAVG";
const SECRET_ACCESS_KEY = "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";

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
		console.log(posts);
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
			console.log("image url:", post.imageUrl);
		}

		console.log("Signed URLs added to posts");
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
			console.log("yo");
			const postsUrls = await addSignedUrlsToPosts();
			console.log("");
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

export default router;

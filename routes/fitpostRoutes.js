import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { storeImage, getImage } from "../data/fitposts.js";
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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//! since i appended to /fitpost in index.js, i simply start with "/" here in fitpost routes
router
	.route("/")
	.get(async (req, res) => {
		res.render("fitposts", { title: "fitposts" });
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
		const post = await storeImage(imageName, req.body.caption);
		res.render("fitposts", { title: "fitposts" });
	});

export default router;

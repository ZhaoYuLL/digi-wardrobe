import { Router } from "express";

//import these to use images
import multer from "multer";
import dotenv from "dotenv";
import {
	s3,
	generateFileName,
	addSignedUrlsToPosts,
	uploadImageToS3,
	deleteImageFromS3,
} from "../helper.js";
// importing database manipulation functions
import {
	storeImage,
	getImage,
	getAllImages,
	deleteImage,
} from "../data/outfitPieces.js";

const router = Router();

//BEGIN include these to use images
//using multer to set up uploading to s3
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//END include these to use images

//! since i appended to /fitpost in index.js, i simply start with "/" here in fitpost routes
router
	.route("/")
	.get(async (req, res) => {
		// addSignedUrlsToPosts;
		try {
			const postsUrls = await addSignedUrlsToPosts();
			//this render file can be changed to what it's supposed to be. right now it
			//is just a temp place to display the images
			//moidfy outfitpieces.handlebars to change what's sent
			if (req.session.user) {
				console.log("hi");
				console.log("user:", req.session.user);
			} else {
				console.log("no user");
			}
			res.render("outfitpieces", { title: "fitposts", posts: postsUrls });
		} catch (error) {
			console.error("Error rendering fitposts:", error);
			res.status(500).send("Internal Server Error");
		}
	})
	//upload.single uploads a single image
	.post(upload.single("image"), async (req, res) => {
		const imageName = await generateFileName();
		const img = await uploadImageToS3(req.file, 1920, 1080, imageName);

		const post = await storeImage(
			req.body.caption,
			imageName,
			req.session.user.username
		);
		res.render("outfitpieces", { title: "fitposts" });
	});
router.route("/:imageName").delete(async (req, res) => {
	try {
		// // getting the imageName, which is the name of the image on s3 bucket
		const s3_image_name = req.params.imageName;

		// example usage: delete from s3, then delete from database
		await deleteImageFromS3(s3_image_name);
		await deleteImage(s3_image_name);

		res.send("Post deleted successfully");
	} catch (error) {
		console.error("Error deleting post:", error);
		res.status(500).send("Internal Server Error");
	}
});

export default router;

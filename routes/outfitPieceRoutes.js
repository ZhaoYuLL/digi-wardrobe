import { Router } from "express";

//import these to use images
import multer from "multer";
import dotenv from "dotenv";
import {
	s3,
	generateFileName,
	addSignedUrlsToPosts,
	addSignedUrlsToOutfitPieces,
	uploadImageToS3,
	deleteImageFromS3,
	validString
} from "../helper.js";
// importing database manipulation functions
import {
	storeImage,
	getImage,
	getAllImages,
	getOutfitPiecesByUsername,
	deleteImage,
} from "../data/outfitPieces.js";
import {
	addUserOutfitPiece,
	deleteUserOutfitPiece
} from "../data/users.js";
import xss from 'xss';

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
		if (!req.session || !req.session.user) {
			res.status(500).send("Not logged in");
		}

		try {
			const userOutfitPieces = await getOutfitPiecesByUsername(req.session.user.username);
			let postsUrls = await addSignedUrlsToOutfitPieces(userOutfitPieces);

			res.render("outfitpieces", { title: "My Clothes", posts: postsUrls, script_partial: "createOutfitPiece_script" });
		} catch (error) {
			console.error("Error rendering fitposts:", error);
			res.status(500).send("Internal Server Error");
		}
	})
	//upload.single uploads a single image
	.post(upload.single("image"), async (req, res) => {
		if (!req.session || req.session.user) {
			res.status(500).send("Not logged in");
		}

		const imageName = await generateFileName();
		const img = await uploadImageToS3(req.file, 1920, 1080, imageName);

		let data = req.body;
		try {
			data.caption = validString(data.caption);
			data.caption = xss(data.caption);
		} catch (e) {
			res.status(400).send(e);
		}
		try {
			data.link = validString(data.link);
			data.link = xss(data.link);
		} catch (e) {
			res.status(400).send(e);
		}
		try {
			data.outfitType = validString(data.outfitType);
			data.outfitType = xss(data.outfitType);
		} catch (e) {
			res.status(400).send(e);
		}

		const post = await storeImage(
			req.body.caption,
			req.body.link,
			req.body.outfitType,
			imageName,
			req.session.user.username
		);
		console.log(post._id);
		const updatedCloset = await addUserOutfitPiece(post, req.session.user._id);
		console.log(updatedCloset);
		res.redirect("/fitposts/create");
	});
router.route("/:imageName").delete(async (req, res) => {
	try {
		// // getting the imageName, which is the name of the image on s3 bucket
		const s3_image_name = req.params.imageName;

		// example usage: delete from s3, then delete from database
		await deleteImageFromS3(s3_image_name);
		const deleted = await deleteImage(s3_image_name);

		const updatedCloset = await deleteUserOutfitPiece(deleted._id, req.session.user._id);
		console.log(updatedCloset);

		res.send("Post deleted successfully");
	} catch (error) {
		console.error("Error deleting post:", error);
		res.status(500).send("Internal Server Error");
	}
});

export default router;

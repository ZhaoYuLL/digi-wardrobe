import { Router } from "express";
import { getAllOutfits } from "../data/testwardrobe.js";
import { addSignedUrlsToFitPosts_in_wardrobe } from "../helper.js";
const router = Router();

router.get("/", (req, res) => {
	// Render your sign-in page
	res.render("index", { title: "Sub-page" });
});
router.get("/closet", (req, res) => {
	// Render your sign-in page
	res.render("closet", { title: "Closet Page" });
});
router.get("/wardrobe", async (req, res) => {
	// Render your sign-in page
	const outfits = await getAllOutfits();
	const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_wardrobe(
		outfits
	);
	// console.log(postsWithSignedUrls.fitposts);
	res.render("wardrobe", {
		title: "Wardrobe Page",
		wardrobes: postsWithSignedUrls,
	});
});
router.get("/favorites", (req, res) => {
	// Render your sign-in page
	res.render("favorites", { title: "Favorite Page" });
});
export default router;

import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
	// Render your sign-in page
	res.render("index");
});
router.get("/closet", (req, res) => {
	// Render your sign-in page
	res.render("closet");
});
router.get("/wardrobe", (req, res) => {
	// Render your sign-in page
	res.render("wardrobe");
});
router.get("/favorites", (req, res) => {
	// Render your sign-in page
	res.render("favorites");
});
export default router;

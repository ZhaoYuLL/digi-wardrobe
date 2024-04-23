import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
	res.redirect("/fitposts");
});
router.route("/fitposts").get(async (req, res) => {
	res.render("fitposts", { title: "fitposts" });
});

export default router;

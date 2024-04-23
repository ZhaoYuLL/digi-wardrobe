import { Router } from "express";
const router = Router();

//! When I use route("/fitposts") it doesn't work, since route("/") done by userRoutes, i reworded it to "/" here
//! since the fitpostRoutes are already mounted on the /fitposts path in index.js,
router.route("/").get(async (req, res) => {
	res.render("fitposts", { title: "fitposts" });
});

export default router;

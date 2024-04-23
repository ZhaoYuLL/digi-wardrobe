import { Router } from "express";
const router = Router();

//! since i appended to /fitpost in index.js, i simply start with "/" here in fitpost routes
router
	.route("/")
	.get(async (req, res) => {
		res.render("fitposts", { title: "fitposts" });
	})
	.post(async (req, res) => {
		console.log(req.body);
		res.render("fitposts", { title: "fitposts" });
	});

export default router;

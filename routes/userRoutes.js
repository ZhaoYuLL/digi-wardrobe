import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
	// Render your sign-in page
	res.render("login");
});
// POST route for handling sign-in form submission
router.post("/login", (req, res) => {
	// Retrieve email and password from request body
	const { email, password } = req.body;

	// Perform authentication logic here, such as checking against a database
	// For demonstration purposes, let's assume the authentication is successful
	// Replace this with your actual authentication logic

	// Redirect the user to their profile page upon successful sign-in
	res.redirect("/userProfile");
});

export default router;

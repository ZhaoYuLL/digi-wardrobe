import { Router } from "express";
const router = Router();
// import data from users 


router.route('/').get(async (req, res) => {
    //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
    return res.json({error: 'YOU SHOULD NOT BE HERE!'});
  });
// POST route for handling sign-in form submission
router
    .route('/register')
    .get(async (req, res) => {
        //code here for GET
        if (req.session.user) {
			res.redirect("/user");
	    }else {
		    res.render("register", { title: "Register" });
	    }
    })
    .post(async (req, res) => {
        //code here for POST
        const { username, firstName, lastName, email, password, confirmPassword, } = req.body;
        if (password !== confirmPassword) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        // else is register user function from user.data
    });

router
    .route('/login')
    .get(async (req, res) => {
      if (req.session.user) {
        res.redirect("/user");
      }
      res.render('login', { pageTitle: 'Login' });
    })
    .post(async (req, res) => {
      //code here for POST
        const { username, password } = req.body;
        // try {
            // const user = await loginUser(username, password);
    });

router.route('/user').get(async (req, res) => {
        //code here for GET
    if (!req.session.user) {
        return res.redirect('/login');
    }
});
      
router.route('/logout').get(async (req, res) => {
        //code here for GET
    req.session.destroy();
    res.render('logout', {pageTitle: "Logout Page"});  
});

router.get("/", (req, res) => {
	// Render your sign-in page
	res.render("login");
});
// POST route for handling sign-in form submission
router.post("/login", (req, res) => {
	// Retrieve email and password from request body
	const { email, password } = req.body;
	console.log(req.body);
	// Perform authentication logic here, such as checking against a database
	// For demonstration purposes, let's assume the authentication is successful
	// Replace this with your actual authentication logic

	// Redirect the user to their profile page upon successful sign-in
	res.redirect("/userProfile");
});

export default router;

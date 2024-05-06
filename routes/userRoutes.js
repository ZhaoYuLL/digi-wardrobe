import { Router } from "express";
const router = Router();
// import data from users 
import { createUser, loginUser } from "../data/users.js";
import { getAll, searchByUID } from "../data/fitposts.js";
import { addSignedUrlsToFitPosts_in_fitposts, validString } from "../helper.js";
import xss from 'xss';

router.route('/').get(async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({ error: 'YOU SHOULD NOT BE HERE!' });
});
// POST route for handling sign-in form submission
router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      res.redirect("/userProfile");
    } else {
      res.render("register", { title: "Register" });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    let { userName, firstName, lastName, age, email, password, confirmPassword } = req.body;

    try {
      userName = validString(userName);
      userName = xss(userName);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      firstName = validString(firstName);
      firstName = xss(firstName);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      lastName = validString(lastName);
      lastName = xss(lastName);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      age = validString(age);
      age = xss(age);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      email = validString(email);
      email = xss(email);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      password = validString(password);
      password = xss(password);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      confirmPassword = validString(confirmPassword);
      confirmPassword = xss(confirmPassword);
    } catch (e) {
      res.status(400).send(e);
    }

    if (password !== confirmPassword) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    try {
      const newUser = await createUser(userName, firstName, lastName, age, email, password);
      req.session.user = newUser;
      res.redirect("/userProfile");
    } catch (err) {
      res.status(400).render("register", {
        error: err,
      });
    }
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
    let { userName, password } = req.body;

    try {
      userName = validString(userName);
      userName = xss(userName);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      password = validString(password);
      password = xss(password);
    } catch (e) {
      res.status(400).send(e);
    }
    try {
      const user = await loginUser(userName, password);

      req.session.user = {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        wardrobes: user.wardrobes,
        closet: user.closet,
        favorite: user.favorite,
        userId: user.userId
      };
      res.redirect('/userProfile');

    } catch (err) {
      res.status(400).render("login", {
        error: err,
      });
    }
  });

router.route('/userProfile').get(async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { username, firstName, lastName, wardrobes, closet, favorite, userId } = req.session.user;

  try {
    // Get all fitposts for the user
    const allFitposts = await searchByUID(userId);
    //test for display
    // const allFitposts = await getAll();

    // Add signed URLs to fitposts
    const fitpostsWithSignedUrls = await addSignedUrlsToFitPosts_in_fitposts(allFitposts);

    res.render('userProfile', {
      userName: username,
      firstName,
      lastName,
      closet,
      favorite,
      allFitposts: fitpostsWithSignedUrls,
      wardrobes,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('An error occurred while fetching user data');
  }
});


router.route('/logout').get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  res.render('logout', { pageTitle: "Logout Page" });
});



export default router;

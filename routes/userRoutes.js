import { Router } from "express";
const router = Router();
// import data from users 
import { createUser, loginUser } from "../data/users.js";
import { getAll, searchByFPID } from "../data/fitposts.js";
import { addSignedUrlsToPosts } from "../helper.js";

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
			  res.redirect("/userProfile");
	    }else {
		    res.render("register", { title: "Register" });
	    }
    })
    .post(async (req, res) => {
        //code here for POST
        const { userName, firstName, lastName, age, email, password, confirmPassword } = req.body;
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
        const { userName, password } = req.body;
        try {
            const user = await loginUser(userName, password);
            req.session.user = {
              username: user.username, 
              firstName: user.firstName, 
              lastName: user.lastName, 
              wardrobes: user.wardrobes, 
              closet: user.closet, 
              favorite: user.favorite,
              fitposts: user.fitposts
            };
            res.redirect('/userProfile');

        }catch (err) {
          res.status(400).render("login", {
            error: err,
          });
        }
    });

// router.route('/userProfile').get(async (req, res) => {
//         //code here for GET
//     if (!req.session.user) {
//         return res.redirect('/login');
//     }
//     const { username, firstName, lastName, wardrobes, closet, favorite } = req.session.user;
//     const userName = username;
//     const allFitpost = getAll();
//     const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_wardrobe(
//       allFitpost
//     );
//   // Add signed URLs to fitposts in wardrobes

//     res.render('userProfile', {userName, firstName, lastName, wardrobes: wardrobesWithSignedUrls,
//       helpers: {displayFitpostImages,} , closet, favorite});  
// });

router.route('/userProfile').get(async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { username, firstName, lastName, wardrobes, closet, favorite } = req.session.user;
  const userName = username;

  // Get all fitposts and add signed URLs
  const allFitposts = await getAll();
  const fitpostsWithSignedUrls = await addSignedUrlsToPosts(allFitposts);

  // Add signed URLs to fitposts in wardrobes
  // const wardrobesWithSignedUrls = await addSignedUrlsToFitPosts_in_wardrobe(wardrobes);

  res.render('userProfile', {
    userName,
    firstName,
    lastName,
    closet,
    favorite,
    allFitposts: fitpostsWithSignedUrls,
    helpers: {
      displayFitpostImages,
    },
  });
});

      
router.route('/logout').get(async (req, res) => {
        //code here for GET
    req.session.destroy();
    res.render('logout', {pageTitle: "Logout Page"});  
});



export default router;

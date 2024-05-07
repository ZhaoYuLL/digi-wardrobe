import { Router } from "express";
const router = Router();
// import data from users
import { createUser, loginUser } from "../data/users.js";

import {
  getAll,
  deleteFitpost,
  updateFitpost,
  searchByFPID,
  searchByUID,
} from "../data/fitposts.js";
import { getAllOutfitPieces } from "../data/testCloset.js";
import {
  addSignedUrlsToFitPosts_in_wardrobe,
  addSignedUrlsToFitPosts_in_closet,
  addDescLinksForFitposts
} from "../helper.js";

import { addSignedUrlsToFitPosts_in_fitposts, validString } from "../helper.js";
import xss from 'xss';
import { getOutfitPiecesByUsername } from "../data/outfitPieces.js";


router.route("/").get(async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({ error: "YOU SHOULD NOT BE HERE!" });
});
// POST route for handling sign-in form submission
router
  .route("/register")
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
    let { userName, firstName, lastName, age, email, password, confirmPassword, bio } = req.body;

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
      return res.status(500).json({ error: "Internal Server Error" });
    }
    try {
      const newUser = await createUser(userName, firstName, lastName, age, email, password, bio);
      req.session.user = newUser;
      res.redirect("/userProfile");
    } catch (err) {
      res.status(400).render("register", {
        error: err,
      });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user) {
      res.redirect("/user");
    }
    res.render("login", { title: "Login" });
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
        bio: user.bio,
        _id: user.userId,
        following: user.following,
      };

      res.redirect("/userProfile");
    } catch (err) {
      res.status(400).render("login", {
        error: err,
      });
    }
  });

router.route("/userProfile").get(async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }


  const { username, firstName, lastName, wardrobes, closet, favorite, _id, bio, following } = req.session.user;
  const userId = _id;
  try {
    // Get all fitposts for the user
    //console.log(req.session.user);
    const allFitposts = await searchByUID(userId);
    //test for display
    const outfitpieces = await getOutfitPiecesByUsername(userId);
    const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_closet(
      outfitpieces
    );

    // Add signed URLs to fitposts
    const fitpostsWithSignedUrls = await addSignedUrlsToFitPosts_in_fitposts(
      allFitposts
    );
    const fitpostsWithOutfitDescLinks = await addDescLinksForFitposts(fitpostsWithSignedUrls);
    console.log(fitpostsWithOutfitDescLinks);

    res.render("userProfile", {
      title: "User Profile",
      userName: username,
      firstName,
      lastName,
      closet,
      favorite,
      bio: bio,
      allFitposts: fitpostsWithOutfitDescLinks,
      wardrobes,
      wardrobes: postsWithSignedUrls,
      outfitpiecesJson: JSON.stringify(postsWithSignedUrls),
      following
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("An error occurred while fetching user data");
  }
});

// Route for deleting a fitpost
router.post("/userprofile/delete-fitpost", async (req, res) => {
  try {
    const { fitpostId } = req.body;
    //console.log(fitpostId);
    await deleteFitpost(fitpostId);
    res.json({ message: "Fitpost deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/userprofile/update-fitpost", async function (req, res) {
  const {
    fitpostId,
    headid,
    bodyid,
    legid,
    footid,
    headwear,
    bodywear,
    legwear,
    footwear,
  } = req.body;
  //console.log(fitpostId);
  //console.log(headid);
  //console.log("headid: ", headid);
  //console.log("headwearname: ", headwear);

  await updateFitpost(fitpostId, "headid", headid);
  await updateFitpost(fitpostId, "headwear", headwear);
  await updateFitpost(fitpostId, "bodywear", bodywear);
  await updateFitpost(fitpostId, "bodyid", bodyid);
  await updateFitpost(fitpostId, "legid", legid);
  await updateFitpost(fitpostId, "legwear", legwear);
  await updateFitpost(fitpostId, "footid", footid);
  await updateFitpost(fitpostId, "footwear", footwear);
  const updatedFitpost = await searchByFPID(fitpostId);

  // Send the updated fitpost as the response
  res.json(updatedFitpost);
});
router.route("/following")
  .get(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    try {
      const { following } = req.session.user;
      const followingUserIds = [...following]; // create a new array by spreading the values of the 'following' array
      // const testUserId = "611a24a197aa3b5a1d315701";
      // followingUserIds.push(testUserId);
      // console.log(followingUserIds);

      const allFitposts = [];
      for (const userId of followingUserIds) {
        const fitposts = await searchByUID(userId);
        allFitposts.push(...fitposts);
      }

      const fitpostsWithSignedUrls = await addSignedUrlsToFitPosts_in_fitposts(allFitposts);

      res.render("following", {
        title: "Following",
        fitposts: fitpostsWithSignedUrls,
      });
    } catch (err) {
      res.status(400).render("login", {
        error: err,
      });
    }
  });

router.route("/logout").get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  res.render("logout", { title: "Logout Page" });
});

export default router;

import { Router } from "express";
const router = Router();
// import data from users
import { createUser, loginUser } from "../data/users.js";
import { getAll, deleteFitpost } from "../data/fitposts.js";
import { addSignedUrlsToFitPosts_in_fitposts } from "../helper.js";
import { getAllOutfitPieces } from "../data/testCloset.js";
import {
  addSignedUrlsToFitPosts_in_wardrobe,
  addSignedUrlsToFitPosts_in_closet,
} from "../helper.js";

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
    const {
      userName,
      firstName,
      lastName,
      age,
      email,
      password,
      confirmPassword,
    } = req.body;
    if (password !== confirmPassword) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    try {
      const newUser = await createUser(
        userName,
        firstName,
        lastName,
        age,
        email,
        password
      );
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
    res.render("login", { pageTitle: "Login" });
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
        userId: user.userId,
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

  const { username, firstName, lastName, wardrobes, closet, favorite, userId } =
    req.session.user;

  try {
    // Get all fitposts for the user
    // const allFitposts = await searchByUID(userId);
    //test for display
    const allFitposts = await getAll();
    const outfitpieces = await getAllOutfitPieces();
    const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_closet(
      outfitpieces
    );

    // Add signed URLs to fitposts
    const fitpostsWithSignedUrls = await addSignedUrlsToFitPosts_in_fitposts(
      allFitposts
    );

    res.render("userProfile", {
      title: "User Profile",
      userName: username,
      firstName,
      lastName,
      closet,
      favorite,
      allFitposts: fitpostsWithSignedUrls,
      wardrobes,
      wardrobes: postsWithSignedUrls,
      outfitpiecesJson: JSON.stringify(postsWithSignedUrls),
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("An error occurred while fetching user data");
  }
});

// Route for deleting a fitpost
router.delete("/fitposts/:id", async (req, res) => {
  try {
    await deleteFitpost(req.params.id);
    res.json({ message: "Fitpost deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/userprofile/update-fitpost", function (req, res) {
  var fitpostId = req.body.fitpostId;
  var headwearSelect = req.body.headwearSelect;
  var bodywearSelect = req.body.bodywearSelect;
  var legwearSelect = req.body.legwearSelect;
  var footwearSelect = req.body.footwearSelect;

  console.log("head: ", headwearSelect);
  console.log("id: ", fitpostId);

  // Perform the update operation in your database
  // Example using Mongoose:
  //   Fitpost.findByIdAndUpdate(
  //     fitpostId,
  //     {
  //       headwear: headwearSelect,
  //       bodywear: bodywearSelect,
  //       legwear: legwearSelect,
  //       footwear: footwearSelect,
  //     },
  //     { new: true },
  //     function (err, updatedFitpost) {
  //       if (err) {
  //         console.error("Error updating fitpost:", err);
  //         res.status(500).json({ error: "Failed to update fitpost" });
  //       } else {
  //         res.json(updatedFitpost);
  //       }
  //     }
  //   );
});

router.route("/logout").get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  res.render("logout", { pageTitle: "Logout Page" });
});

export default router;

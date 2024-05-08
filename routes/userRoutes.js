import { Router } from "express";
import multer from "multer";
import xss from "xss";
import { createUser, loginUser } from "../data/users.js";
import {
  getAll,
  deleteFitpost,
  updateFitpost,
  searchByFPID,
  searchByUID,
} from "../data/fitposts.js";
import { getAllOutfitPieces } from "../data/testCloset.js";
import { getAllFitpics } from "../data/fitpics.js";

import {
  addSignedUrlsToFitPosts_in_wardrobe,
  addSignedUrlsToFitPosts_in_closet,
  addDescLinksForFitposts,
  generateFileName,
  uploadImageToS3,
  addSignedUrlsToProfile,
  addSignedUrlsToFitPosts_in_fitposts,
  validString,
} from "../helper.js";

const router = Router();

// Multer configuration for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET route for user profile
router.get("/userProfile", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const {
    username,
    firstName,
    lastName,
    wardrobes,
    closet,
    favorite,
    _id,
    bio,
    following,
    profilePicture,
  } = req.session.user;

  try {
    const allFitposts = await searchByUID(_id);
    const outfitpieces = await getOutfitPiecesByUsername(_id);
    const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_closet(
      outfitpieces
    );
    const fitpostsWithSignedUrls = await addSignedUrlsToFitPosts_in_fitposts(
      allFitposts
    );
    const fitpostsWithOutfitDescLinks = await addDescLinksForFitposts(
      fitpostsWithSignedUrls
    );
    const pfp = await addSignedUrlsToProfile(profilePicture);

    res.render("userProfile", {
      title: "User Profile",
      profilePicture: pfp,
      userName: username,
      firstName,
      lastName,
      closet,
      favorite,
      bio,
      allFitposts: fitpostsWithOutfitDescLinks,
      wardrobes: postsWithSignedUrls,
      outfitpiecesJson: JSON.stringify(postsWithSignedUrls),
      following,
      following,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("An error occurred while fetching user data");
  }
});

// GET route for registration form
router.get("/register", async (req, res) => {
  if (req.session.user) {
    res.redirect("/userProfile");
  } else {
    res.render("register", { title: "Register" });
  }
});

// POST route for user registration
router.post("/register", upload.single("image"), async (req, res) => {
  try {
    let {
      userName,
      firstName,
      lastName,
      age,
      email,
      password,
      confirmPassword,
      bio,
    } = req.body;

    // Validate and sanitize input fields
    userName = validString(xss(userName));
    firstName = validString(xss(firstName));
    lastName = validString(xss(lastName));
    age = validString(xss(age));
    email = validString(xss(email));
    password = validString(xss(password));
    confirmPassword = validString(xss(confirmPassword));
    const imageName = await generateFileName();

    const profilePicture = await uploadImageToS3(
      req.file,
      1920,
      1080,
      imageName
    );
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const newUser = await createUser(
      userName,
      firstName,
      lastName,
      age,
      email,
      password,
      bio,
      profilePicture
    );

    req.session.user = newUser;
    res.redirect("/userProfile");
  } catch (error) {
    res.status(400).render("register", {
      error: error.message,
    });
  }
});

// GET route for login form
router.get("/login", async (req, res) => {
  if (req.session.user) {
    res.redirect("/userProfile");
  } else {
    res.render("login", { title: "Login" });
  }
});

// POST route for user login
router.post("/login", async (req, res) => {
  try {
    let { userName, password } = req.body;

    // Validate and sanitize input fields
    userName = validString(xss(userName));
    password = validString(xss(password));

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
      profilePicture: user.profilePicture,
    };

    res.redirect("/userProfile");
  } catch (error) {
    res.status(400).render("login", {
      error: error.message,
    });
  }
});

// POST route for deleting a fitpost
router.post("/userprofile/delete-fitpost", async (req, res) => {
  try {
    const { fitpostId } = req.body;
    await deleteFitpost(fitpostId);
    res.json({ message: "Fitpost deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST route for updating a fitpost
router.post("/userprofile/update-fitpost", async (req, res) => {
  try {
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

    await updateFitpost(fitpostId, "headid", headid);
    await updateFitpost(fitpostId, "headwear", headwear);
    await updateFitpost(fitpostId, "bodywear", bodywear);
    await updateFitpost(fitpostId, "bodyid", bodyid);
    await updateFitpost(fitpostId, "legid", legid);
    await updateFitpost(fitpostId, "legwear", legwear);
    await updateFitpost(fitpostId, "footid", footid);
    await updateFitpost(fitpostId, "footwear", footwear);

    const updatedFitpost = await searchByFPID(fitpostId);
    res.json(updatedFitpost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET route for following page
router.get("/following", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    const { following } = req.session.user;
    const followingUserIds = [...following];

    const allFitposts = [];
    for (const userId of followingUserIds) {
      const fitposts = await searchByUID(userId);
      allFitposts.push(...fitposts);
    }

    const fitpostsWithSignedUrls = await addSignedUrlsToFitPosts_in_fitposts(
      allFitposts
    );

    res.render("following", {
      title: "Following",
      fitposts: fitpostsWithSignedUrls,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "An error occurred while fetching following data",
    });
  }
});

// GET route for user logout
router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.render("logout", { title: "Logout Page" });
});
router.route("/fitpics").get(async (req, res) => {
  const fitpics = await getAllFitpics();
  const fitUrls = await addSignedUrlsToFitPosts_in_fitpics(fitpics);

  res.render("fitpics", {title : "fitpics",
  fitpics: fitUrls})
});

export default router;

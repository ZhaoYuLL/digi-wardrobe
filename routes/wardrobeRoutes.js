import { Router } from "express";
import { getAllOutfits } from "../data/testwardrobe.js";
import { getAllOutfitPieces } from "../data/testCloset.js";
import { createFP, getAll } from "../data/fitposts.js";
import { fitposts, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {
  addSignedUrlsToFitPosts_in_wardrobe,
  addSignedUrlsToFitPosts_in_closet,
  addSignedUrlsToFitPosts_in_fitposts,
  addDescLinksForFitposts_inWardrobes,
} from "../helper.js";
import xss from "xss";
import { getAllFromCloset } from "../data/outfitPieces.js";
import { getAllWardrobes, getWardrobesByUsername } from "../data/wardrobes.js";

const router = Router();

router.get("/", (req, res) => {
  // Render your sign-in page
  if (!req.session || !req.session.user) {
    res.status(500).send("Not logged in");
  }
  res.render("index", { title: "Sub-page" });
});
router.get("/closet", async (req, res) => {
  // Render your sign-in page
  if (!req.session || !req.session.user) {
    res.status(500).send("Not logged in");
  }
  try {
    const outfitpieces = await getAllFromCloset(req.session.user.username);
    const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_closet(
      outfitpieces
    );

    const { username } = req.session.user;
    res.render("closet", {
      title: "Closet Page",
      username: username,
      outfitpieces: postsWithSignedUrls,
      outfitpiecesJson: JSON.stringify(postsWithSignedUrls),
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/wardrobe", async (req, res) => {
  // Render your sign-in page
  if (!req.session || !req.session.user) {
    res.status(500).send("Not logged in");
  }
  try {
    const outfits = await getWardrobesByUsername(req.session.user.username);
    const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_wardrobe(
      outfits
    );
    const postsWithDescLinks = await addDescLinksForFitposts_inWardrobes(
      postsWithSignedUrls
    );

    res.render("wardrobe", {
      title: "Wardrobe Page",
      wardrobes: postsWithDescLinks,
      wardrobesJson: JSON.stringify(postsWithSignedUrls),
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/favorites", async (req, res) => {
  // Render your sign-in page
  if (!req.session || !req.session.user) {
    res.status(500).send("Not logged in");
  }

  async function getFavoriteFitposts(username) {
    try {
      // Get the user's favorite array
      const usersCollection = await users();
      const user = await usersCollection.findOne(
        { username: username },
        { favorite: 1 }
      );
      //   const favoriteIds = user.favorite;

      // Convert favoriteIds to ObjectId
      const favoriteIds = ["6638dc15cdc617f979c324e8"];
      const favoriteObjectIds = favoriteIds.map((id) => new ObjectId(id));

      // Find the fitposts that match the favorite IDs
      const fitpostCollection = await fitposts();
      const favoriteFitposts = await fitpostCollection
        .find({
          _id: { $in: favoriteObjectIds },
        })
        .toArray();

      return favoriteFitposts;
    } catch (error) {
      console.error("Error retrieving favorite fitposts:", error);
      throw error;
    }
  }

  try {
    const favorites = await getFavoriteFitposts(req.session.user.username);
    // Handle the favorites data as needed
    const favWithUrl = await addSignedUrlsToFitPosts_in_fitposts(favorites);
    res.render("favorites", {
      title: "Favorites Page",
      fitposts: favWithUrl,
    });
  } catch (error) {
    console.error("Error retrieving favorites:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;

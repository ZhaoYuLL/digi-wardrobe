import { Router } from "express";
import { getAllOutfits } from "../data/testwardrobe.js";
import { getAllOutfitPieces } from "../data/testCloset.js";
import {
  addSignedUrlsToFitPosts_in_wardrobe,
  addSignedUrlsToFitPosts_in_closet,
} from "../helper.js";

const router = Router();

router.get("/", (req, res) => {
  // Render your sign-in page
  res.render("index", { title: "Sub-page" });
});
router.get("/closet", async (req, res) => {
  // Render your sign-in page
  const outfitpieces = await getAllOutfitPieces();
  const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_closet(
    outfitpieces
  );
  res.render("closet", {
    title: "Closet Page",
    outfitpieces: postsWithSignedUrls,
    outfitpiecesJson: JSON.stringify(postsWithSignedUrls),
  });
});
router.get("/wardrobe", async (req, res) => {
  // Render your sign-in page
  const outfits = await getAllOutfits();
  const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_wardrobe(
    outfits
  );
  //   console.log(postsWithSignedUrls[0].wardrobeName);
  // console.log(postsWithSignedUrls.fitposts);
  res.render("wardrobe", {
    title: "Wardrobe Page",
    wardrobes: postsWithSignedUrls,
    wardrobesJson: JSON.stringify(postsWithSignedUrls),
  });
});
router.get("/favorites", (req, res) => {
  // Render your sign-in page
  res.render("favorites", { title: "Favorite Page" });
});
export default router;

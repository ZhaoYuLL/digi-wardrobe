import { Router } from "express";
import { getAllOutfits } from "../data/testwardrobe.js";
import { getAllOutfitPieces } from "../data/testCloset.js";
import { createFP } from "../data/fitposts.js";
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
router.post("/create-fitpost", async (req, res) => {
  try {
    const selectedOutfits = JSON.parse(req.body.msg);
    console.log("Received selected outfits:", selectedOutfits);

    // Extract the outfit data from the selectedOutfits object
    const { foot, body, leg, head } = selectedOutfits;

    console.log("foot", foot);
    console.log("body", body);
    console.log("leg", leg);
    console.log("head", head);

    // Call the createFP function with the received data
    const newFitpost = await createFP(
      "user123", // Replace with the actual user ID
      "johndoe", // Replace with the actual username
      head,
      body,
      leg,
      foot
    );

    // Send a success response back to the client as JSON
    res.json({ message: "Fitpost created successfully", fitpost: newFitpost });
  } catch (error) {
    console.error("Error creating fitpost:", error);
    res
      .status(500)
      .json({ message: "Error creating fitpost", error: error.message });
  }
});
export default router;

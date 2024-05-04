import userRoutes from "./userRoutes.js";
import fitpostRoutes from "./fitpostRoutes.js";
import outfitPieceRoutes from "./outfitPieceRoutes.js";
import wardrobeRoutes from "./wardrobeRoutes.js";
import { static as staticDir } from "express";

const constructorMethod = (app) => {
  // just basic setup, feel free to change routes
  app.use("/", userRoutes); //change to userRoutes
  app.use("/fitposts", fitpostRoutes);
  app.use("/outfitpieces", outfitPieceRoutes);
  app.use("/index", wardrobeRoutes);

  app.use("/public", staticDir("public"));
  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructorMethod;

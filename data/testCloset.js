import { outfitPieces } from "../config/mongoCollections.js";

export const getAllOutfitPieces = async () => {
  const outfitpiecesCollection = await outfitPieces();

  // Find all documents in the outfitPieces collection
  const allOutfitPieces = await outfitpiecesCollection.find({}).toArray();

  console.log(`Found ${allOutfitPieces.length} outfit pieces!`);
  return allOutfitPieces;
};

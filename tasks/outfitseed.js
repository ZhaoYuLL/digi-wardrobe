import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { storeWardrobe, getAllOutfits } from "../data/testwardrobe.js";
import { fitposts } from "../config/mongoCollections.js";
import {
  storeImage,
  getImage,
  getAllImages,
  deleteImage,
} from "../data/outfitPieces.js";
import { outfitPieces } from "../config/mongoCollections.js";

import { generateFileName } from "../helper.js";

const db = await dbConnection();
await db.dropDatabase();
//leave top alone

async function createFitpost(fitpost) {
  const fitpostCollection = await fitposts();
  const insertInfo = await fitpostCollection.insertOne(fitpost);
  if (insertInfo.insertedCount === 0) throw "Could not add fitpost";
  return insertInfo.insertedId;
}

// await generateFileName()
const hat = "79974a7c8b9aeced4f99773386f2b113d568c2f6d8efc6382d2119c332e668c0";
const hat2 = "88191896f6945e8aaff7451f6fffd55e0644305a9876b2465873dda7d4a256b3";
const hat3 = "83c18c2666007d7fdfaeb2097876f8f035e5e0e9b9e41a69cfa814921696fda8";
const hat4 = "f7c9f354cc588116c5812400db2e714f0f264d1106e05b0756d0fdf13b0922a8";
const jean = "5610728dbe350f784c47ab82c953f2ef28bc5124c18d235251840cedd173b149";
const tanktop =
  "9903ab6777c1152911aa57db1d21aceb48c5817354cdceab710e5b31745ee211";
const sweater =
  "45d2fa1ee8c08bb6a4db932a87e5efeaf7d01096854efa8c97c895d676f4b389";
const shoes =
  "7768dac33c9cfae0fdbe8a3f28389f25b1bfb4bbe4ac6b1880f9dc91e55d1fea";

//store outfit piece in outfit collection function
const storeOutfitPiece = async (id, link, outfitType, imageName, username) => {
  const outfitPiecesCollection = await outfitPieces();

  // Create a new document with the provided caption and imageName
  const newImage = {
    _id: id,
    link: link,
    outfitType: outfitType,
    imageName: imageName,
    username,
  };

  // Insert the new document into the outfitPieces collection
  const result = await outfitPiecesCollection.insertOne(newImage);

  // Check if the insertion was successful
  if (result.insertedId) {
    console.log("Image stored successfully");
    return result.insertedId;
  } else {
    throw new Error("Failed to store image");
  }
};

// stores out fit pieces shoes
await storeOutfitPiece(
  "711a24a197aa3b5a1c314701",
  "google.com",
  "foot",
  shoes,
  "z"
);
//stores seater
await storeOutfitPiece(
  "711a24a197aa3b5a1c314702",
  "nike.com",
  "body",
  sweater,
  "z"
);
await storeOutfitPiece(
  "711a24a197aa3b5a1c314703",
  "nike.com",
  "leg",
  jean,
  "z"
);
await storeOutfitPiece(
  "711a24a197aa3b5a1c314704",
  "nike.com",
  "head",
  hat,
  "z"
);
await storeOutfitPiece(
  "711a24a197aa3b5a1c314705",
  "nike.com",
  "head",
  hat2,
  "z"
);
await storeOutfitPiece(
  "711a24a197aa3b5a1c314706",
  "nike.com",
  "head",
  hat2,
  "z"
);
await storeOutfitPiece(
  "711a24a197aa3b5a1c314707",
  "nike.com",
  "head",
  hat3,
  "z"
);
await storeOutfitPiece(
  "711a24a197aa3b5a1c314708",
  "nike.com",
  "head",
  hat2,
  "z"
);

//gets a shoe id
const outfitPiecesCollection = await outfitPieces();
const shoe = await outfitPiecesCollection.findOne({
  username: "z",
});
const shoe_id = shoe._id;
const head_id = "711a24a197aa3b5a1c314704";
const leg_id = "711a24a197aa3b5a1c314703";
const body_id = "711a24a197aa3b5a1c314702";

//creates a fitpost
const fitpost8 = {
  _id: "611a24a197aa3b5a1c314708",
  user_id: "611a24a197aa3b5a1c314624",
  username: "z",
  postedDate: {
    $date: "2024-04-10T00:00:00.000Z",
  },
  headwear: hat,
  bodywear: sweater,
  legwear: jean,
  footwear: shoes,
  headid: head_id,
  bodyid: body_id,
  legid: leg_id,
  footid: shoe_id,

  likes: 22,
  saves: 15,
};

//creates a wardrobe
const w1 = [
  fitpost8,
  {
    _id: "60e4c8fd25602e41d4b9271c",
    user_id: "60e4c8fd25602e41d4b9271d",
    username: "z",
    postedDate: "2024-04-28T10:30:00Z",
    headwear: hat2,
    bodywear: tanktop,
    legwear: "joggers.jpg",
    footwear: "boots.jpg",
    likes: 75,
    saves: 30,
  },
];

//creates a second wardrobe
const w2 = [
  {
    _id: "60e4c8fd25602e41d4b9271a",
    user_id: "60e4c8fd25602e41d4b9271b",
    username: "z",
    postedDate: "2024-04-27T08:00:00Z",
    headwear: hat3,
    bodywear: sweater,
    legwear: jean,
    footwear: shoes,
    likes: 100,
    saves: 50,
  },
  {
    _id: "60e4c8fd25602e41d4b9271c",
    user_id: "60e4c8fd25602e41d4b9271d",
    username: "z",
    postedDate: "2024-04-28T10:30:00Z",
    headwear: hat4,
    bodywear: "hoodie.jpg",
    legwear: "joggers.jpg",
    footwear: "boots.jpg",
    likes: 75,
    saves: 30,
  },
];

await storeWardrobe("summer wardrobe", w1, "z");
await storeWardrobe("spring capsule", w2, "z");
await createFitpost(fitpost8);

//this is how to access a collection from another collection
const fitpostCollection = await fitposts();
const user_id = "611a24a197aa3b5a1c314624";
const cursor = await fitpostCollection.find({ user_id: user_id });

for (const doc of await cursor.toArray()) {
  const outfitPiecesCollection = await outfitPieces();
  const foot = await outfitPiecesCollection.findOne({
    _id: doc.footid,
  });
  console.log(
    `accessing outfit piece object attributes using id; currently accessing link: "${foot.link}"`
  );

  console.log("footwear id (outfit piece)", doc.footid);
  console.log("footwear image name", doc.footwear);
}
//leave bottom alone
console.log("Done seeding database");
await closeConnection();

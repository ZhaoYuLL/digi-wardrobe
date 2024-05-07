import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { storeWardrobe, getAllOutfits } from "../data/testwardrobe.js";
import { fitposts, users } from "../config/mongoCollections.js";
import {
  storeImage,
  getImage,
  getAllImages,
  deleteImage,
} from "../data/outfitPieces.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { outfitPieces } from "../config/mongoCollections.js";

import { generateFileName } from "../helper.js";

const db = await dbConnection();
await db.dropDatabase();
//leave top alone

const passwordHelper = async (password) => {
  // will probably move to a helper function file
  const saltRounds = 2;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

async function createFitpost(fitpost) {
  const fitpostCollection = await fitposts();
  const insertInfo = await fitpostCollection.insertOne(fitpost);
  if (insertInfo.insertedCount === 0) throw "Could not add fitpost";
  return insertInfo.insertedId;
}

const storeOutfitPiece = async (id, link, outfitType, imageName, username) => {
  const outfitPiecesCollection = await outfitPieces();

  // Create a new document with the provided caption and imageName
  const newImage = {
    _id: new ObjectId(id),
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

const hat1 = "79974a7c8b9aeced4f99773386f2b113d568c2f6d8efc6382d2119c332e668c0";
const hl1 =
  "https://www.dickies.com/hats-beanies/corduroy-cap/WHR55CB++AL.html?cm_mmc=google-_-PLA-_-accessories-hats-_-WHR55&cm_mmc=Google-_-20286891758-_-151470110338-_-&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjtn6jcWwlTo-3GV0GT7dVMvXLeBd0kUpuHvbqHd7wPAf7D05Hs91RMaArw6EALw_wcB";
const hat2 = "88191896f6945e8aaff7451f6fffd55e0644305a9876b2465873dda7d4a256b3";
const hl2 =
  "https://duckcamp.com/products/redfish-hat-coastal-blue?variant=43012239556739&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&tw_source=google&tw_adid=637009533105&tw_campaign=19026166991&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjsdoi4ITaoTHYGOeIdUzGuR05mh5VKXmSBHF1fJBtL1ES82JmgSwrMaAoijEALw_wcB";
const hat3 = "83c18c2666007d7fdfaeb2097876f8f035e5e0e9b9e41a69cfa814921696fda8";
const hl3 =
  "https://insomniavisuals.com/products/glitch-logo-beanie?variant=46857130770710&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&utm_campaign=insomnia_acquire_pmax&src=PAIDGOOGLE20699418717&utm_id=20699418717&tw_source=google&tw_adid=&tw_campaign=20699418717&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjsLWzIoLsPc3Dnod9kV_bBwwb196wIHY6Ez_T7g8qjWiwhlofDBIKgaArWkEALw_wcB";
const hat4 = "f7c9f354cc588116c5812400db2e714f0f264d1106e05b0756d0fdf13b0922a8";
const hl4 =
  "https://www.stussy.com/collections/headwear/products/1311107-new-era-9twenty-basic-strapback-real-tree-edge";
const hat5 = "381585bba207507afc883c06f9386daaca3e7e0348296e63d245ca77b27490f4";
const hl5 =
  "https://www.stussy.com/collections/headwear/products/1321023-stock-bucket-hat-whea";

const body1 =
  "9903ab6777c1152911aa57db1d21aceb48c5817354cdceab710e5b31745ee211";
const b1 =
  "https://www.sopula.com/products/vintage-mask-gangster-girl-graphic-cotton-t-shirt?variant=b4c8fa53-4240-4c08-b83a-547ec6ccdf7c&SP01-PMax-US-230804-Tee&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjvrgTXVVlyXo6CawR_jzmnY4P9em4NpCSEK0F4y-7LqtjUqeOXhPgMaAur-EALw_wcB";
const body2 =
  "900318f0c920ea3a6568466a9443572f0bc2105f8e89f69cfa156246a77cfc76";
const b2 =
  "https://www2.hm.com/en_us/productpage.1216430005.html?gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjts4z7kveb7ek9SOZ2dp68_P4vbL6Ek_7C4YsyRwceI1lquR5qOLVkaAmU4EALw_wcB";
const body3 =
  "24db0a3756ee1cb23b254879484992f3b7f51dbc1b66559d0e650c4634f4af03";
const b3 =
  "https://www.ebbets.com/products/new-york-black-yankees-eff-nlb-pinstripe-button-down-jersey?currency=USD&variant=43375186542781&utm_source=google&utm_medium=cpc&utm_campaign=Google%20Shopping&stkn=39837da7d479&tw_source=google&tw_adid=&tw_campaign=20851855663&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjvhnbJvOY6MAsHHUgXusQuf293nnPSHKgnqKi4d5kxAzwsoKETDHUkaAnleEALw_wcB";
const body4 =
  "45d2fa1ee8c08bb6a4db932a87e5efeaf7d01096854efa8c97c895d676f4b389";
const b4 =
  "https://www.amazon.com/Obenie-Alphabet-Pattern-Harajuku-Clothing/dp/B0C3Z7ZZFF/ref=asc_df_B0C3Z7ZZFF/?tag=hyprod-20&linkCode=df0&hvadid=693770472623&hvpos=&hvnetw=g&hvrand=10099103996959119236&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9003488&hvtargid=pla-2258755556127&psc=1&mcid=a3589d71bdcc3d6a936de66932da0d4a&gad_source=4&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjv1btOV47jLoLIC-bRdrUptqlrWHDyH4Y3o3YfJj3ETBgUm15q2Z0waAneEEALw_wcB";
const body5 =
  "87e1790c470ff0ee7f64bb26f4f57b152e7b208e33d82c417b61c8799e06fc6f";
const b5 =
  "https://www.shopcider.com/product/detail?pid=1028465&style_id=130265&sku_id=135535&currency=USD&local=en&country=US&utm_source=google_shopping&utm_campaign=AdTiger_PLA_US_0_mia_0704&link_id=06dcb3b5976144558c7f14d9197b1c45&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjtSjVWTaFa5koA7mR-sJq_WoyXSXF-2KkCRTmBr2SnlD2szOYKUNmQaAp1HEALw_wcB";

const leg1 = "5610728dbe350f784c47ab82c953f2ef28bc5124c18d235251840cedd173b149";
const l1 =
  "https://www.acnestudios.com/us/en/acne-studios-2023m-fn-delta/B00336-BUF.html?g=man";
const leg2 = "5055e8754a875829b4702f4a2de80099e21773b43832abf91b7f3b8727155817";
const l2 =
  "https://www.acnestudios.com/us/en/cargo-trousers-charcoal-grey/AK0754-Z79.html?g=woman";
const leg3 = "bf03b450f21c096a134e6476845dc8718a6cef887108fe618cb1ecec1f3801e9";
const l3 =
  "https://www.bershka.com/us/faded-effect-skater-cargo-pants-c0p150004033.html?colorId=700";
const leg4 = "6bf7f0d0a26a36219746a654f5c7f37fe027295941343a006b858e3b75d46f12";
const l4 =
  "https://www.bershka.com/us/super-baggy-denim-bermuda-jorts-c0p156554399.html?colorId=500";
const leg5 = "c605df2784962dbabec797eb05896a6fa728cdc511c57b5bd62aeee5b90cbe75";
const l5 = "https://www.vintagekid.no/shop/p/y2k-denim-skirt";

const foot1 =
  "7768dac33c9cfae0fdbe8a3f28389f25b1bfb4bbe4ac6b1880f9dc91e55d1fea";
const f1 =
  "https://www.drmartens.com/us/en/8053-leather-platform-casual-shoes-black/p/24690001?gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjuavVW7AKzHjXCzp2icYyZHKU4TwvdDzvqD6309l3XCRUKo3O_NezAaArExEALw_wcB";
const foot2 =
  "b2e9c8d82f40fd6c1d69c3dcca81b9bf24f505dda2521d28c4ed026925f5aa50";
const f2 =
  "https://www.goat.com/sneakers/travis-scott-x-air-jordan-1-retro-high-og-cd4487-100?utm_source=google_ads&utm_medium=cpc&utm_campaign=20272243100&utm_content=&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjtQpt_H0TN-6ARHOKS6JuYSmPn9ZjYkzPCL-toSFPkXezf_fHQiq6caAtK_EALw_wcB";
const foot3 =
  "a09ce3fbaec4194ffde61f6096399ba09332f3c42a9880503e7a4d7fc9cc810e";
const f3 =
  "https://www.goat.com/sneakers/mexico-66-kill-bill-2023-1183c102-751?utm_source=google_ads&utm_medium=cpc&utm_campaign=20915717960&utm_content=&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDju4y7svOkO9yDRxTtTUVlf2zHO_syDP-uZDrBK_32cLVGiBV-e4JRMaAkb1EALw_wcB";
const foot4 =
  "8f352859c6e40a8247f525445a3bae510c9fdedd1b0f0c6c4f6cc74ce51e768b";
const f4 =
  "https://www.goat.com/sneakers/mschf-big-red-boot-mschf010?utm_source=google_ads&utm_medium=cpc&utm_campaign=20915717960&utm_content=&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjsKS5S4lP2ZH4uJScTIIULOmGrypxdcWbZaRfvMH1gNWSfoHlj_4HAaApXCEALw_wcB";
const foot5 =
  "8d153ff7ed0de4de0636466a02c64201e837006cf1f1cbe35719b6507444da62";
const f5 =
  "https://www.amazon.com/Skechers-Infinite-Lights-Fresh-Sneaker-Purple/dp/B0C4RFMJP5/ref=asc_df_B0C4RFMJP5/?tag=hyprod-20&linkCode=df0&hvadid=693366131672&hvpos=&hvnetw=g&hvrand=2841967388123079606&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9003488&hvtargid=pla-2192159859802&psc=1&mcid=d27d69b57eef39c4ba07e3dd53f145e6&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjtMguYkhQdF6q-7i8ClF9kAnMKgyylsC32Z8RPYwTew1cKBpurYTo8aAh2eEALw_wcB";

const seedOutfitPieces = async () => {
  await storeOutfitPiece(
    "711a24a197aa3b5a1c314701",
    hl1,
    "head",
    hat1,
    "spongebob"
  );
  await storeOutfitPiece(
    "711a24a197aa3b5a1c314702",
    hl2,
    "head",
    hat2,
    "spongebob"
  );
  await storeOutfitPiece(
    "711a24a197aa3b5a1c314703",
    hl3,
    "head",
    hat3,
    "spongebob"
  );
  await storeOutfitPiece(
    "711a24a197aa3b5a1c314704",
    hl4,
    "head",
    hat4,
    "spongebob"
  );
  await storeOutfitPiece(
    "711a24a197aa3b5a1c314705",
    hl5,
    "head",
    hat5,
    "spongebob"
  );

  await storeOutfitPiece(
    "811a24a197aa3b5a1c314701",
    b1,
    "body",
    body1,
    "spongebob"
  );
  await storeOutfitPiece(
    "811a24a197aa3b5a1c314702",
    b2,
    "body",
    body2,
    "spongebob"
  );
  await storeOutfitPiece(
    "811a24a197aa3b5a1c314703",
    b3,
    "body",
    body3,
    "spongebob"
  );
  await storeOutfitPiece(
    "811a24a197aa3b5a1c314704",
    b4,
    "body",
    body4,
    "spongebob"
  );
  await storeOutfitPiece(
    "811a24a197aa3b5a1c314705",
    b5,
    "body",
    body5,
    "spongebob"
  );

  await storeOutfitPiece(
    "911a24a197aa3b5a1c314701",
    l1,
    "leg",
    leg1,
    "spongebob"
  );
  await storeOutfitPiece(
    "911a24a197aa3b5a1c314702",
    l2,
    "leg",
    leg2,
    "spongebob"
  );
  await storeOutfitPiece(
    "911a24a197aa3b5a1c314703",
    l3,
    "leg",
    leg3,
    "spongebob"
  );
  await storeOutfitPiece(
    "911a24a197aa3b5a1c314704",
    l4,
    "leg",
    leg4,
    "spongebob"
  );
  await storeOutfitPiece(
    "911a24a197aa3b5a1c314705",
    l5,
    "leg",
    leg5,
    "spongebob"
  );

  await storeOutfitPiece(
    "101a24a197aa3b5a1c314701",
    f1,
    "foot",
    foot1,
    "spongebob"
  );
  await storeOutfitPiece(
    "101a24a197aa3b5a1c314702",
    f2,
    "foot",
    foot2,
    "spongebob"
  );
  await storeOutfitPiece(
    "101a24a197aa3b5a1c314703",
    f3,
    "foot",
    foot3,
    "spongebob"
  );
  await storeOutfitPiece(
    "101a24a197aa3b5a1c314704",
    f4,
    "foot",
    foot4,
    "spongebob"
  );
  await storeOutfitPiece(
    "101a24a197aa3b5a1c314705",
    f5,
    "foot",
    foot5,
    "spongebob"
  );
};

const newUser = {
  _id: new ObjectId("611a24a197aa3b5a1d315701"),
  username: "spongebob",
  firstName: "spongebob",
  lastName: "squarepants",
  age: "420",
  email: "pineapple@underthesea@gmail.com",
  password: await passwordHelper("Squidward1@"),
  wardrobes: [],
  closet: [
    "711a24a197aa3b5a1c314701",
    "711a24a197aa3b5a1c314702",
    "711a24a197aa3b5a1c314703",
    "711a24a197aa3b5a1c314704",
    "711a24a197aa3b5a1c314705",
    "811a24a197aa3b5a1c314701",
    "811a24a197aa3b5a1c314702",
    "811a24a197aa3b5a1c314703",
    "811a24a197aa3b5a1c314704",
    "811a24a197aa3b5a1c314705",
    "911a24a197aa3b5a1c314701",
    "911a24a197aa3b5a1c314702",
    "911a24a197aa3b5a1c314703",
    "911a24a197aa3b5a1c314704",
    "911a24a197aa3b5a1c314705",
    "101a24a197aa3b5a1c314701",
    "101a24a197aa3b5a1c314702",
    "101a24a197aa3b5a1c314703",
    "101a24a197aa3b5a1c314704",
    "101a24a197aa3b5a1c314705",
  ],
  favorite: ["721a24a197aa3b5a1c314701"],
};
const userCollection = await users();
const newInsertInformation = await userCollection.insertOne(newUser);
const fp1 = {
  _id: new ObjectId("611a24a197aa3b5a1c315701"),
  user_id: "611a24a197aa3b5a1d315701",
  username: "spongebob",
  postedDate: "2024-04-10T00:00:00.000Z",
  headwear: hat1,
  bodywear: body1,
  legwear: leg1,
  footwear: foot1,
  headid: "711a24a197aa3b5a1c314701",
  bodyid: "811a24a197aa3b5a1c314701",
  legid: "911a24a197aa3b5a1c314701",
  footid: "101a24a197aa3b5a1c314701",
  likes: 22,
  saves: 15,
};
const fp2 = {
  _id: new ObjectId("611a24a197aa3b5a1c315702"),
  user_id: "611a24a197aa3b5a1d315701",
  username: "spongebob",
  postedDate: "2024-04-12T00:00:00.000Z",
  headwear: hat2,
  bodywear: body2,
  legwear: leg2,
  footwear: foot2,
  headid: "711a24a197aa3b5a1c314702",
  bodyid: "811a24a197aa3b5a1c314702",
  legid: "911a24a197aa3b5a1c314702",
  footid: "101a24a197aa3b5a1c314702",
  likes: 100,
  saves: 15,
};
const fp3 = {
  _id: new ObjectId("611a24a197aa3b5a1c315703"),
  user_id: "611a24a197aa3b5a1d315701",
  username: "spongebob",
  postedDate: "2024-04-13T00:00:00.000Z",
  headwear: hat3,
  bodywear: body3,
  legwear: leg3,
  footwear: foot4,
  headid: "711a24a197aa3b5a1c314703",
  bodyid: "811a24a197aa3b5a1c314703",
  legid: "911a24a197aa3b5a1c314703",
  footid: "101a24a197aa3b5a1c314703",
  likes: 0,
  saves: 0,
};
const w1 = [fp1, fp2, fp3];

await seedOutfitPieces();
await createFitpost(fp1);
await createFitpost(fp2);
await createFitpost(fp3);

await storeWardrobe(
  new ObjectId("721a24a197aa3b5a1c314701"),
  "summer",
  w1,
  "spongebob"
);
console.log("Done seeding database");
await closeConnection();

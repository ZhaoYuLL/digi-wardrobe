import { fitposts } from "../config/mongoCollections.js";

import { ObjectId } from "mongodb";
import { validString } from "../helper.js";

const getAll = async () => {
  const fitpostCollection = await fitposts();
  let fpList = await fitpostCollection.find({}).toArray();
  if (!fpList) throw "There are no fitposts";

  // replaces ObjectId with string
  fpList = fpList.map((element) => {
    element._id = element._id.toString();
    return element;
  });

  // fisher-yates shuffle algorithm to randomize order
  for (let i = fpList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fpList[i], fpList[j]] = [fpList[j], fpList[i]];
  }

  // remove later
  //console.log('getAll():',fpList);

  return fpList;
};

const latest = async () => {
  let fpList = await getAll();
  fpList.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

  // remove later
  //console.log('latest', fpList);

  return fpList;
};

const trending = async () => {
  let fpList = await getAll();
  // some formula to find most trending
  fpList.sort((a, b) => b.likes + b.saves - (a.likes + a.saves));

  // remove later
  console.log("trending", fpList);

  return fpList;
};

const searchByUID = async (uid) => {
  uid = validString(uid);
  let fpList = await latest();
  fpList = fpList.filter((fp) => fp.user_id === uid);
  if (!fpList) throw "There are no user of that id";

  // remove later
  console.log("uid", fpList);

  return fpList;
};

const searchByFPID = async (id) => {
  id = validString(id);
  const fitpostCollection = await fitposts();
  const fp = await fitpostCollection.findOne({ _id: new ObjectId(id) });
  if (fp === null) throw "No fitpost with that id";

  // replaces ObjectId with string
  fp._id = fp._id.toString();

  // remove later
  console.log(fp);

  return fp;
};

const createFP = async (
  user_id,
  username,
  headwear,
  bodywear,
  legwear,
  footwear
) => {
  // find a way to validate these ids
  user_id = validString(user_id);
  username = validString(username);
  headwear = validString(headwear);
  bodywear = validString(bodywear);
  legwear = validString(legwear);
  footwear = validString(footwear);

  let likes = 0;
  let saves = 0;

  let date = new Date();

  let formattedDate = date.toISOString().split("T")[0];

  let newFP = {
    user_id,
    postedDate: formattedDate,
    headwear,
    bodywear,
    legwear,
    footwear,
    likes,
    saves,
  };

  const fitpostCollection = await fitposts();
  const insertInfo = await fitpostCollection.insertOne(newFP);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "could not add fitpost womp womp";

  // converts id to string to get the product object
  const newId = insertInfo.insertedId.toString();
  const fp = await searchByFPID(newId);
  return fp;
  //return newProduct;
};

export { getAll, latest, trending, searchByUID, searchByFPID, createFP };

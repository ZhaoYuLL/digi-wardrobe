import { ObjectId } from "mongodb";
import { wardrobe } from "../config/mongoCollections.js";
import * as fp from "./fitposts.js";
import * as user from "./users.js";

const getAllWardrobes = async () => {
  const wardrobeCollection = await wardrobe();
  return wardrobeCollection.find({}).toArray();
};

const getWardrobeById = async (id) => {
  // TODO: validate id parameter
  const wardrobeCollection = await wardrobe();
  const drobe = await wardrobeCollection.findOne(
    { _id: new ObjectId(id) },
    { projection: { password: 0 } }
  );
  return drobe;
};

const getWardrobesByIds = async (wardrobeArray) => {
  const wardrobeObjects = [];
  for (let id of wardrobeArray) {
    const wardrobeObject = await getWardrobeById(id);
    wardrobeObjects.push(wardrobeObject);
  }
  return wardrobeObjects;
};

const getWardrobesByUsername = async (username) => {
  const wardrobeCollection = await wardrobe();
  const userWardrobes = await wardrobeCollection
    .find({ username: username })
    .toArray();
  if (!userWardrobes) throw new Error(`Error getting ${username}'s wardrobes`);

  return userWardrobes;
};

const createNewWardrobe = async (wardrobeName, fpId, uId) => {
  let fitpost = await fp.searchByFPID(fpId);
  let currentUser = await user.getUserById(uId);
  const newDrobe = {
    wardrobeName: wardrobeName,
    fitposts: [fitpost],
    username: currentUser.username,
  };

  // check if name is already in use

  const userWardrobes = currentUser.wardrobes;
  for (const wardrobeId of userWardrobes) {
    const wardrobeObject = await getWardrobeById(wardrobeId);
    if (wardrobeObject.wardrobeName === wardrobeName) {
      throw new Error("Wardrobe name is already taken");
    }
  }

  // creates new wardrobe
  const wardrobeCollection = await wardrobe();
  const newInsertInformation = await wardrobeCollection.insertOne(newDrobe);
  if (!newInsertInformation.insertedId)
    throw new Error("Error creating new wardrobe");

  //return getWardrobeById(newInsertInformation.insertedId);
  return newInsertInformation.insertedId.toString();
};

const addFitpost = async (drobeId, fpId) => {
  const wardrobeCollection = await wardrobe();
  const drobe = await wardrobeCollection.findOne({
    _id: new ObjectId(drobeId),
  });

  if (drobe === null) throw "No user with that id";

  let fps = drobe.fitposts;
  let newFp = await fp.searchByFPID(fpId);
  fps.push(newFp);

  const updateDrobe = {
    fitposts: fps,
  };

  const updatedInfo = await wardrobeCollection.findOneAndUpdate(
    { _id: new ObjectId(drobeId) },
    { $set: updateDrobe },
    { returnDocument: "after" }
  );

  if (!updatedInfo) {
    throw "Could not update user successfully";
  }

  updatedInfo._id = updatedInfo._id.toString();
  return updatedInfo;
};

export {
  getAllWardrobes,
  getWardrobeById,
  getWardrobesByIds,
  getWardrobesByUsername,
  createNewWardrobe,
  addFitpost,
};

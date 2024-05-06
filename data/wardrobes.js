import { ObjectId } from "mongodb";
import { wardrobe } from "../config/mongoCollections.js";

const getAllWardrobes = async () => {
    const wardrobeCollection = await wardrobe();
    return wardrobeCollection.find({}).toArray();
}

const getWardrobeById = async (id) => {
    // TODO: validate id parameter
    const wardrobeCollection = await wardrobe();
    const wardrobe = await wardrobeCollection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    return user;
}

const getWardrobesByIds = async (ids) => {
    const wardrobeObjects = [];
    for (let id of ids) {
        const wardrobeObject = await getWardrobeById(id);
        wardrobeObjects.push(wardrobeObject);
    }
    return wardrobeObjects;
}

export { getAllWardrobes, getWardrobeById, getWardrobesByIds };


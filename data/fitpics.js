import { fitpics } from "../config/mongoCollections.js";

export const storeFitpic = async (imageName,username) => {
    const fitpicCollection = await fitpics(); 
    const newFitpic = {
        username,
        imageName: imageName
    }
    const result = await fitpicCollection.insertOne(newFitpic);
    if (result.insertedId) {
        // console.log("Image stored successfully");
        return result.insertedId;
    } else {
        throw new Error("Failed to store image");
    }
}

export const getFitpic = async (imageName) => {
    const fitpicCollection = await fitpics(); 
    const fitpic = await fitpicCollection.findOne({
        imageName: imageName,
    })
    if (fitpic) {
        return fitpic;
    }else{
        throw "Image not found";
    }
}

export const getAllFitpics = async () => {
    const fitpicCollection = await fitpics();
    let fpList = await fitpicCollection.find({}).toArray();
    console.log(fpList)
    if (fpList.length === 0) return [];
  
    // replaces ObjectId with string
    fpList = fpList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
  
  
    // remove later
    //console.log('getAll():',fpList);
  
    return fpList;
  };
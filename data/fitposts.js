import { fitposts } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';


const getAll = async () => {
    const fitpostCollection = await fitposts();
    let fpList = await fitpostCollection.find({}).toArray();
    if (!fpList) throw 'Could not get all fitposts oop';
    
    // replaces ObjectId with string
    fpList = fpList.map((element) => {
      element._id = element._id.toString();
      return element;
    })
    return fpList;
  };
  
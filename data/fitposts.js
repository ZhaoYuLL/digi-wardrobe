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

    // remove later
    console.log('getAll():',fpList);

    return fpList;
  };

const latest = async() => {
    let fpList = await getAll();
    fpList.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    return fpList;
}

const trending = async() => {
    let fpList = await getAll();
    // some formula to find most trending
    fpList.sort((a, b) => (b.likes + b.saves) - (a.likes + a.saves));
    return fpList;
}


export{getAll, latest, trending}
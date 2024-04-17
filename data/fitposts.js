import { fitposts } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import * as helper from '../helper.js';



const getAll = async () => {
    const fitpostCollection = await fitposts();
    let fpList = await fitpostCollection.find({}).toArray();
    if (!fpList) throw 'There are no fitposts';
    
    // replaces ObjectId with string
    fpList = fpList.map((element) => {
      element._id = element._id.toString();
      return element;
    })

    // fisher-yates shuffle algorithm to randomize order
    for (let i = fpList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fpList[i], fpList[j]] = [fpList[j], fpList[i]];
    }

    // remove later
    //console.log('getAll():',fpList);

    return fpList;
  };


const latest = async() => {
    let fpList = await getAll();
    fpList.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

    // remove later
    //console.log('latest', fpList);

    return fpList;
}

const trending = async() => {
    let fpList = await getAll();
    // some formula to find most trending
    fpList.sort((a, b) => (b.likes + b.saves) - (a.likes + a.saves));

    // remove later
    console.log('trending', fpList);

    return fpList;
}

const searchByUID = async(uid) => {
    uid = helper.validString(uid);
    let fpList = await latest();
    fpList = fpList.filter(fp => fp.user_id === uid);
    if (!fpList) throw 'There are no fitposts';

    // remove later
    console.log('uid', fpList);

    return fpList;

}

export{getAll, latest, trending, searchByUID}
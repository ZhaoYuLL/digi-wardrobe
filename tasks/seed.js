import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { getAllUsers, getUserById, createUser, updateUserInfo, deleteUser } from '../data/users.js';
import { createFP } from '../data/fitposts.js';

const db = await dbConnection();
await db.dropDatabase();

let users = [];

users.push(await createUser("username1", "Cindy", "Lee", "21", "clee28@stevens.edu", "test"));
users.push(await createUser("username2", "Condy", "Li", "26", "clee26@stevens.edu", "test"));
users.push(await createUser("username3", "John", "Doe", "18", "johndoe@gmail.com", "test"));
users.push(await createUser("username4", "Jane", "Doe", "37", "janedoe@gmail.com", "test"));

const hat = "0084a3ce67c6bcc90ee7792bddfbd4e105ed1ae2a48d297fdc302f6308496fda";
const hat2 = "7101237a6d2ef9ae0103ff8ef2d0afe0cb929bd4916eb85605ebd059be373a89";
const hat3 = "c932a50074e44707f7f1b9bc0768caa3bef341887beadfa313f6b88f18ff7756";
const hat4 = "3927eeb715b128eaac7e754129d3eab033bd86240aa4d4995bf32083e3587a2d";
const jean = "e8017cd5326d13759dd71dde65b76d842e3b71fef0bbfb39f66ffb5c31b2e145";
const tanktop =
    "a090356d90b6d2a8611349c805fe25589d7ca3b109b33ae5e35127c0cc39e9ba";
const sweater =
    "211c977fa571cfcc50555af6d4556e76accd38fdada20577eb99fdb352a60bac";
const shoes =
    "b252d8e80320fd288feadb7cc3fc86c6e385f8ea9212ea5d2bffde21d689aa50";



console.log('Done seeding database');
await closeConnection();
import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";

const getAllUsers = async () => {
    const userCollection = await users();
    return userCollection.find({}).toArray();
}

const getUserById = async (id) => {
    // TODO: validate id parameter
    const userCollection = await users();
    const user = userCollection.find({ _id: new ObjectId(id) });
    if (!user) throw new Error(`Error getting user with id: ${id}`);
    return user;
}

const getUserByUserName = async (userName) => {
    // TODO: validate userName parameter
    const userCollection = await users();
    const user = userCollection.find({ userName: userName });
    if (!user) throw new Error(`Error getting user with username: ${userName}`);
    return user;
}

const getUserByEmail = async (email) => {
    // TODO: validate email parameter
    const userCollection = await users();
    const user = userCollection.find({ email: email });
    if (!user) throw new Error(`Error getting user with email: ${email}`);
    return user;
}

const passwordHelper = async (password) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

const createUser = async (userName, firstName, lastName, age, email, password) => {
    // TODO: validate all parameters
    const passwordHash = passwordHelper(password);
    const newUser = {
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        age: age,
        email: email,
        passoword: passwordHash,
        wardrobes: [],
        closet: [],
        favorite: []
    }
    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (!newInsertInformation._id) throw new Error("Error creating new user");
    return getUserById(newInsertInformation._id);
}
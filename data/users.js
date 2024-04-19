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
        password: passwordHash,
        wardrobes: [],
        closet: [],
        favorite: [],
        // might add profile pic when we get image storage working
    }
    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (!newInsertInformation._id) throw new Error("Error creating new user");
    return getUserById(newInsertInformation._id);
}

const updateUserInfo = async (id, userInfo) => {
    // TODO: input validation
    const changes = {};

    if (userInfo.userName) {
        // TODO: validate username
        changes['userName'] = userInfo.userName;
    }
    if (userInfo.firstName) {
        // TODO: validate first name
        changes['firstName'] = userInfo.firstName;
    }
    if (userInfo.lastName) {
        // TODO: validate last name
        changes['lastName'] = userInfo.lastName;
    }
    if (userInfo.age) {
        // TODO: validate age
        changes['age'] = userInfo.age;
    }
    if (userInfo.email) {
        // TODO: validate email
        changes['email'] = userInfo.email;
    }
    if (userInfo.password) {
        // TODO: validate password
        const hash = passwordHelper(userInfo.password);
        changes['password'] = hash;
    }

    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: userInfo },
        { returnDocument: 'after' }
    );
    if (!updateInfo) throw new Error('Error updating user info');

    return updateInfo;
}

const deleteUser = async (id) => {
    // TODO: validate id and that a user with that id exists
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });
    if (!deletionInfo) throw `Error: Could not delete user with id of ${id}`;

    return { ...deletionInfo, deleted: true };
}

export { getAllUsers, getUserById, createUser, updateUserInfo, deleteUser };
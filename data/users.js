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
    const user = userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) throw new Error(`Error getting user with id: ${id}`);
    return user;
}

const getUserByusername = async (username) => {
    // Made this to check if a username already exists
    // TODO: validate username parameter
    const userCollection = await users();
    const user = userCollection.find({ username: username });
    if (!user) throw new Error(`Error getting user with username: ${username}`);
    return user;
}

const getUserByEmail = async (email) => {
    // Made this to check if an account with the given email already exists
    // TODO: validate email parameter
    const userCollection = await users();
    const user = userCollection.find({ email: email });
    if (!user) throw new Error(`Error getting user with email: ${email}`);
    return user;
}

const passwordHelper = async (password) => {
    // will probably move to a helper function file
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

export const passwordMatch = async (input, hash) => {
    // will probably move to a helper function file
    const match = await bcrypt.compare(input, hash);
    return match;
}

const createUser = async (username, firstName, lastName, age, email, password) => {
    // TODO: validate all parameters
    const userExists = await getUserByusername(username);
    if (userExists) throw new Error(`User with username ${username} already exists`);

    const passwordHash = await passwordHelper(password);
    const newUser = {
        username: username,
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
    if (!newInsertInformation.insertedId) throw new Error("Error creating new user");
    return getUserById(newInsertInformation.insertedId);
}

const updateUserInfo = async (id, userInfo) => {
    // For now, this only updates the user info that the user can directly edit
    // Assuming wardrobes, closet, and favorites will be edited in a different file
    // TODO: input validation
    const changes = {};

    if (userInfo.username) {
        // TODO: validate username
        const userExists = await getUserByusername(userInfo.username);
        if (userExists) throw new Error(`User with username ${userInfo.username} already exists`);
        changes['username'] = userInfo.username;
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
        { $set: changes },
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

const loginUser = async (username, password) => {
    // TODO: validate inputs
    const userCollection = await users();
    const foundUser = await userCollection.findOne({ username: username });
    if (!foundUser) throw new Error(`Either the username or password is invalid`);
    console.log(foundUser.password);
    const match = await passwordMatch(password, foundUser.password);
    if (!match) throw new Error(`Either the username or password is invalid`);

    const userInfo = {
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        username: foundUser.username,
        wardrobes: foundUser.wardrobes,
        closet: foundUser.closet,
        favorite: foundUser.favorite
    }

    return userInfo;
}

const addUserOutfitPiece = async (outfitPieceId, userId) => {
    // TODO: validate inputs
    const user = await getUserById(userId);
    let userCloset = user.closet;
    userCloset.push(outfitPieceId);

    updatedCloset = {
        closet: userCloset
    };
    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: changes },
        { returnDocument: 'after' }
    );
    if (!updateInfo) throw new Error(`Error updating user ${userId} closet with outfit piece ${outfitPieceId}`);

    return updateInfo.closet;
}

const deleteUserOutfitPiece = async (outfitPieceId, userId) => {
    // TODO: validate inputs
    const user = await getUserById(userId);
    let userCloset = user.closet;
    const index = userCloset.indexOf(outfitPieceId);
    if (index > -1) {
        userCloset.splice(index, 1);
    }

    updatedCloset = {
        closet: userCloset
    };
    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedCloset },
        { returnDocument: 'after' }
    );
    if (!updateInfo) throw new Error(`Error removing outfit piece ${outfitPieceId} from user ${userId}'s closet`);

    return updateInfo.closet;
}

const addUserFavorites = async (userId, fitpostId) => {
    // TODO: validate inputs
    const user = await getUserById(userId);
    let userFavorites = user.favorite;
    userFavorites.push(fitpostId);

    updatedFavorites = {
        closet: userFavorites
    };
    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedFavorites },
        { returnDocument: 'after' }
    );
    if (!updateInfo) throw new Error(`Error updating user ${userId} favorites with fitpost ${outfitPieceId}`);

    return updateInfo.favorite;
}

const deleteUserFavorite = async (userId, fitpostId) => {
    // TODO: validate inputs
    const user = await getUserById(userId);
    let userFavorites = user.favorite;
    const index = userFavorites.indexOf(fitpostId);
    if (index > -1) {
        userFavorites.splice(index, 1);
    }

    updatedFavorites = {
        closet: userFavorites
    };
    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedFavorites },
        { returnDocument: 'after' }
    );
    if (!updateInfo) throw new Error(`Error updating user ${userId} favorites with fitpost ${outfitPieceId}`);

    return updateInfo.favorite;
}

export { getAllUsers, getUserById, createUser, updateUserInfo, deleteUser };

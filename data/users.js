import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import {
    checkRequiredFields,
    checkIfFieldsAreProperString,
    isValidEmail,
    isValidPassword,
    isValidAge
} from "../helper.js";

const getAllUsers = async () => {
    const userCollection = await users();
    return userCollection.find({}).toArray();
}

const getUserById = async (id) => {
    // TODO: validate id parameter
    const idString = JSON.stringify(id);
    checkRequiredFields(
        idString
    );
    checkIfFieldsAreProperString(idString);
    if (!ObjectId.isValid(id)) {
        throw 'Invalid ObjectId';
    }
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    // if (!user) throw `Error getting user with id: ${id}`;
    return user;
}

export const getUserByUsername = async (username) => {
    // Made this to check if a username already exists
    // TODO: validate username parameter
    username = username.trim();
    checkRequiredFields(
        username
    );
    checkIfFieldsAreProperString(username);
    const lowercaseUsername = username.toLowerCase();
    const userCollection = await users();
    const user = await userCollection.findOne({ username: lowercaseUsername });
    // if (!user) throw new Error(`Error getting user with username: ${username}`);
    return user;
}

const getUserByEmail = async (email) => {
    // Made this to check if an account with the given email already exists
    // TODO: validate email parameter
    email = email.trim();
    checkRequiredFields(
        email
    );
    const lowercaseEmail = email.toLowerCase();
    const userCollection = await users();
    const user = await userCollection.findOne({ email: lowercaseEmail });
    // if (!user) throw new Error(`Error getting user with email: ${email}`);
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

const createUser = async (username, firstName, lastName, age, email, password, bio) => {
    // TODO: validate all parameters
    firstName = firstName.trim();
    lastName = lastName.trim();
    username = username.trim();
    password = password.trim();
    email = email.trim();
    age = age.trim();

    checkRequiredFields(
        firstName,
        lastName,
        username,
        password,
        age,
        email,
    );
    checkIfFieldsAreProperString(
        firstName,
        lastName,
        username,
        password,
        age,
        email,
    );
    const lowercaseUsername = username.toLowerCase();
    const userExists = await getUserByUsername(lowercaseUsername);
    if (userExists) throw `User with username ${username} already exists`;
    const lowercaseEmail = email.toLowerCase();

    const emailExists = await getUserByEmail(lowercaseEmail);
    // console.log(emailExists)
    if (emailExists) throw `User with email ${email} already exists`;
    isValidEmail(email);
    isValidPassword(password);
    isValidAge(age);

    const passwordHash = await passwordHelper(password);
    const newUser = {
        username: lowercaseUsername,
        firstName: firstName,
        lastName: lastName,
        age: age,
        email: lowercaseEmail,
        password: passwordHash,
        bio: bio,
        wardrobes: [],
        closet: [],
        favorite: [],
        following: []
        // might add profile pic when we get image storage working
    }
    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (!newInsertInformation.insertedId) throw "Error creating new user";
    return getUserById(newInsertInformation.insertedId);
}

const updateUserInfo = async (id, userInfo) => {
    // For now, this only updates the user info that the user can directly edit
    // Assuming wardrobes, closet, and favorites will be edited in a different file
    // TODO: input validation
    const changes = {};
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid ObjectId');
    }
    if (userInfo.username) {
        // TODO: validate username
        const newUsername = userInfo.username.trim().toLowerCase();
        checkIfFieldsAreProperString(newUsername);
        const userExists = await getUserByUsername(newUsername);
        if (userExists) throw `User with username ${userInfo.username} already exists`;
        changes['username'] = userInfo.username;
    }
    if (userInfo.firstName) {
        // TODO: validate first name
        const newFirst = userInfo.firstName.trim();
        checkIfFieldsAreProperString(newFirst);
        changes['firstName'] = newFirst;
    }
    if (userInfo.lastName) {
        // TODO: validate last name
        const newLast = userInfo.firstLast.trim();
        checkIfFieldsAreProperString(newLast);
        changes['lastName'] = newLast;
    }
    if (userInfo.age) {
        // TODO: validate age
        const newAge = userInfo.age.trim();
        isValidAge(newAge);
        changes['age'] = newAge;
    }
    if (userInfo.email) {
        // TODO: validate email
        const newEmail = userInfo.email.trim();
        isValidEmail(newEmail);
        changes['email'] = userInfo.newEmail;
    }
    if (userInfo.password) {
        // TODO: validate password
        const newPassword = userInfo.password.trim();
        checkIfFieldsAreProperString(newPassword);
        const hash = passwordHelper(newPassword);
        changes['password'] = hash;
    }

    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: changes },
        { returnDocument: 'after' }
    );
    if (!updateInfo) throw 'Error updating user info';

    return updateInfo;
}

const deleteUser = async (id) => {
    // TODO: validate id and that a user with that id exists
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid ObjectId');
    }
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });
    if (!deletionInfo) throw `Error: Could not delete user with id of ${id}`;

    return { ...deletionInfo, deleted: true };
}

const loginUser = async (username, password) => {
    // TODO: validate inputs
    username = username.trim();
    password = password.trim();

    checkRequiredFields(username, password);
    const lowercaseUsername = username.toLowerCase();

    const userCollection = await users();
    const foundUser = await userCollection.findOne({ username: lowercaseUsername });
    if (!foundUser) throw `Either the username or password is invalid`;
    const match = await passwordMatch(password, foundUser.password);
    if (!match) throw `Either the username or password is invalid`;

    const userInfo = {
        userId: foundUser._id, // Include userId in the returned userInfo object
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        username: foundUser.username,
        wardrobes: foundUser.wardrobes,
        closet: foundUser.closet,
        favorite: foundUser.favorite,
        bio: foundUser.bio, 
        following: foundUser.following
    }
    return userInfo;
}

export const addUserOutfitPiece = async (outfitPieceId, userId) => {
    if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid User Id');
    }
    if (!ObjectId.isValid(outfitPieceId)) {
        throw new Error('Invalid outfitPieceId');
    }
    const user = await getUserById(userId);
    let userCloset = user.closet;
    userCloset.push(outfitPieceId);

    let updatedCloset = {
        closet: userCloset
    };
    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updatedCloset },
        { returnDocument: 'after' }
    );
    if (!updateInfo) throw `Error updating user ${userId} closet with outfit piece ${outfitPieceId}`;

    return updateInfo.closet;
}

export const deleteUserOutfitPiece = async (outfitPieceId, userId) => {
    if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid User Id');
    }
    if (!ObjectId.isValid(outfitPieceId)) {
        throw new Error('Invalid outfitPieceId');
    }
    const user = await getUserById(userId);
    let userCloset = user.closet;
    const index = userCloset.indexOf(outfitPieceId);
    if (index > -1) {
        userCloset.splice(index, 1);
    }

    let updatedCloset = {
        closet: userCloset
    };
    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updatedCloset },
        { returnDocument: 'after' }
    );
    if (!updateInfo) throw `Error removing outfit piece ${outfitPieceId} from user ${userId}'s closet`;

    return updateInfo.closet;
}

const addUserFavorites = async (userId, fitpostId) => {
    if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid User Id');
    }
    if (!ObjectId.isValid(fitpostId)) {
        throw new Error('Invalid fitpost Id');
    }
    const user = await getUserById(userId);
    let userFavorites = user.favorite;
    userFavorites.push(fitpostId);

    let updatedFavorites = {
        favorite: userFavorites
    };
    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updatedFavorites },
        { returnDocument: 'after' }
    );
    if (!updateInfo) throw `Error updating user ${userId} favorites with fitpost ${outfitPieceId}`;

    return updateInfo.favorite;
}

const deleteUserFavorite = async (userId, fitpostId) => {
    if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid User Id');
    }
    if (!ObjectId.isValid(fitpostId)) {
        throw new Error('Invalid fitpost Id');
    }
    const user = await getUserById(userId);
    let userFavorites = user.favorite;
    const index = userFavorites.indexOf(fitpostId);
    if (index > -1) {
        userFavorites.splice(index, 1);
    }

    let updatedFavorites = {
        favorite: userFavorites
    };
    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updatedFavorites },
        { returnDocument: 'after' }
    );
    if (!updateInfo) throw `Error updating user ${userId} favorites with fitpost ${outfitPieceId}`;

    return updateInfo.favorite;
}


const checkLike = async (userId, fpId) => {
    if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid User Id');
    }
    if (!ObjectId.isValid(fpId)) {
        throw new Error('Invalid fitpost Id');
    }
    const user = await getUserById(userId);
    if (user) {
        return user.favorite.includes(fpId);
    }
    else {
        return false;
    }
}



const addLike = async (userId, fpId) => {
    if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid User Id');
    }
    if (!ObjectId.isValid(fpId)) {
        throw new Error('Invalid fitpost Id');
    }
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (user === null) throw 'No fitpost with that id';

    // replaces ObjectId with string
    user._id = user._id.toString();

    user.favorite.push(fpId);

    let newFavorite = user.favorite;
    const updateUser = {
        favorite: newFavorite
    }

    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateUser },
        { returnDocument: 'after' }
    );

    if (!updatedInfo) {
        throw 'could not update successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;

}


const removeLike = async (userId, fpId) => {

    if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid User Id');
    }
    if (!ObjectId.isValid(fpId)) {
        throw new Error('Invalid fitpost Id');
    }

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (user === null) throw 'No user with that id';

    const index = user.favorite.indexOf(fpId);
    if (index === -1) throw 'Fitpost not found in favorites';

    user.favorite.splice(index, 1);

    const updateUser = {
        favorite: user.favorite
    };

    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateUser },
        { returnDocument: 'after' }
    );

    if (!updatedInfo) {
        throw 'Could not update user successfully';
    }

    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};


const addWardrobe = async (userId, drobeId) => {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (user === null) throw 'No user with that id';

    let drobe = user.wardrobes;
    drobe.push(drobeId)



    const updateUser = {
        wardrobes: drobe
    };

    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateUser },
        { returnDocument: 'after' }
    );

    if (!updatedInfo) {
        throw 'Could not update user successfully';
    }

    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};


const addToCloset = async (userId, pid) => {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (user === null) throw 'No user with that id';

    let closet = user.closet;
    closet.push(pid)



    const updateUser = {
        closet: closet
    };

    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateUser },
        { returnDocument: 'after' }
    );

    if (!updatedInfo) {
        throw 'Could not update user successfully';
    }

    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};
/*const checkSave = async(userId, fpId, wardrobeId) => {
    const user = await getUserById(userId);
    if (user) {
        for (drobe of user.wardrobes) {
            if (drobe._id === wardrobeId){
                return (drobe.)
            }
        }
    }
    return false;
}*/



export { getAllUsers, getUserById, createUser, updateUserInfo, deleteUser, loginUser, checkLike, addLike, removeLike, addWardrobe, addToCloset };
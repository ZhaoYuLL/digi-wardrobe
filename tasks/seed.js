import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { getAllUsers, getUserById, createUser, updateUserInfo, deleteUser } from '../data/users.js';

const db = await dbConnection();
await db.dropDatabase();

let user1 = undefined;
let user2 = undefined;

try {
    user1 = await createUser("firstuser", "John", "Doe", 21, "johndoe1@gmail.com", "Jojojo2553!7");
    const user = await getUserById(user1._id.toString());
    console.log(user);
} catch (error) {
    console.error(error.message);
}

try {
    user2 = await createUser("seconduser", "Jane", "Doe", 22, "jaanedo@gmail.com", "password2#");
    console.log(await getUserById(user2._id.toString()));
} catch (error) {
    console.error(error.message);
}

try {
    const allusers = await getAllUsers();
    console.log(allusers);
} catch (error) {
    console.error(error.message);
}


console.log('Done seeding database');
await closeConnection();
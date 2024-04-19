import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { getAllUsers, getUserById, createUser, updateUserInfo, deleteUser } from '../data/users.js';

const db = await dbConnection();
await db.dropDatabase();

let user1;
let user2;

try {
    user1 = await createUser("firstuser", "John", "Doe", 21, "johndoe1@gmail.com", "Jojojo2553!7");
    console.log(user1);
    const id = user1._id.toString();
    console.log(await getUserById(id));
} catch (error) {
    console.error(error.message);
}

try {
    user2 = await createUser("seconduser", "Jane", "Doe", 22, "jaanedo@gmail.com", "password2#");
    console.log(user2);
    const id = user2._id.toString();
    console.log(await getUserById(id));
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
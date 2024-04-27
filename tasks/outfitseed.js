import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { storeImage, getAllOutfits } from "../data/testwardrobe.js";
import { generateFileName } from "../helper.js";

const db = await dbConnection();
await db.dropDatabase();
//leave top alone

// await generateFileName()
const str = "785b7cb8b53d08232c89c88f06a7ad0c7e59acaeccc85119665c4775c73f127e";
const str2 = "785b7cb8b53d08232c89c88f06a7ad0c7e59acaeccc85119665c4775c73f127f";

const a = await getAllOutfits();
const fitposts = {
	users: [
		{
			_id: 1,
			username: "john_doe",
			email: "john.doe@example.com",
			age: 30,
			address: {
				street: "123 Main St",
				city: "New York",
				state: "NY",
				zipcode: "10001",
			},
			orders: [
				{
					_id: 101,
					product: "Smartphone",
					quantity: 1,
					price: 599.99,
				},
				{
					_id: 102,
					product: "Laptop",
					quantity: 1,
					price: 1299.99,
				},
			],
		},
		{
			_id: 2,
			username: "jane_smith",
			email: "jane.smith@example.com",
			age: 25,
			address: {
				street: "456 Elm St",
				city: "Los Angeles",
				state: "CA",
				zipcode: "90001",
			},
			orders: [
				{
					_id: 103,
					product: "Headphones",
					quantity: 2,
					price: 99.99,
				},
			],
		},
	],
	products: [
		{
			_id: 201,
			name: "Smartphone",
			brand: "Apple",
			price: 599.99,
		},
		{
			_id: 202,
			name: "Laptop",
			brand: "Dell",
			price: 1299.99,
		},
		{
			_id: 203,
			name: "Headphones",
			brand: "Sony",
			price: 99.99,
		},
	],
};
await storeImage("cat", str, "headwear", fitposts);
await storeImage("dog", str2, "legwear");

//leave bottom alone
console.log("Done seeding database");
await closeConnection();

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { storeWardrobe, getAllOutfits } from "../data/testwardrobe.js";
import { generateFileName } from "../helper.js";

const db = await dbConnection();
await db.dropDatabase();
//leave top alone

// await generateFileName()
const hat = "0084a3ce67c6bcc90ee7792bddfbd4e105ed1ae2a48d297fdc302f6308496fda";
const jean = "e8017cd5326d13759dd71dde65b76d842e3b71fef0bbfb39f66ffb5c31b2e145";
const sweater =
	"211c977fa571cfcc50555af6d4556e76accd38fdada20577eb99fdb352a60bac";
const shoes =
	"b252d8e80320fd288feadb7cc3fc86c6e385f8ea9212ea5d2bffde21d689aa50";
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
const fp = [
	{
		_id: "60e4c8fd25602e41d4b9271a",
		user_id: "60e4c8fd25602e41d4b9271b",
		postedDate: "2024-04-27T08:00:00Z",
		headwear: hat,
		bodywear: sweater,
		legwear: jean,
		footwear: shoes,
		likes: 100,
		saves: 50,
	},
	{
		_id: "60e4c8fd25602e41d4b9271c",
		user_id: "60e4c8fd25602e41d4b9271d",
		postedDate: "2024-04-28T10:30:00Z",
		headwear: "beanie.jpg",
		bodywear: "hoodie.jpg",
		legwear: "joggers.jpg",
		footwear: "boots.jpg",
		likes: 75,
		saves: 30,
	},
];

await storeWardrobe("summer day", fp);
await storeWardrobe("academic weapon", fp);

//leave bottom alone
console.log("Done seeding database");
await closeConnection();

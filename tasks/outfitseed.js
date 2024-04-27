import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { storeImage, getAllOutfits } from "../data/testwardrobe.js";
import { generateFileName } from "../helper.js";

const db = await dbConnection();
await db.dropDatabase();
//leave top alone

// await generateFileName()
const str = "4e953a865ab0362b1985bd3de9a0f7d08d6244789d2516150fa0dc3075cb9d3d";

const str3 =
	"https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg";

const str4 = "9b3ad1d27fc5fdd19a7b334ed956a40ef5b54f46ea146c9efd00a946214638b9";
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
		link: str,
		headwear: "hat.jpg",
		bodywear: "shirt.jpg",
		legwear: "jeans.jpg",
		footwear: "sneakers.jpg",
		likes: 100,
		saves: 50,
	},
	{
		_id: "60e4c8fd25602e41d4b9271c",
		user_id: "60e4c8fd25602e41d4b9271d",
		postedDate: "2024-04-28T10:30:00Z",
		link: str4,
		headwear: "beanie.jpg",
		bodywear: "hoodie.jpg",
		legwear: "joggers.jpg",
		footwear: "boots.jpg",
		likes: 75,
		saves: 30,
	},
];

await storeImage("cat", "summer day", fp);
await storeImage("dog", "academic weapon", fp);

//leave bottom alone
console.log("Done seeding database");
await closeConnection();

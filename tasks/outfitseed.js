import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { storeWardrobe, getAllOutfits } from "../data/testwardrobe.js";
import { fitposts } from "../config/mongoCollections.js";
import {
	storeImage,
	getImage,
	getAllImages,
	deleteImage,
} from "../data/outfitPieces.js";
import { outfitPieces } from "../config/mongoCollections.js";

import { generateFileName } from "../helper.js";

const db = await dbConnection();
await db.dropDatabase();
//leave top alone

async function createFitpost(fitpost) {
	const fitpostCollection = await fitposts();
	const insertInfo = await fitpostCollection.insertOne(fitpost);
	if (insertInfo.insertedCount === 0) throw "Could not add fitpost";
	return insertInfo.insertedId;
}

// await generateFileName()
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

//store outfit piece in outfit collection function
const storeOutfitPiece = async (id, link, outfitType, imageName, username) => {
	const outfitPiecesCollection = await outfitPieces();

	// Create a new document with the provided caption and imageName
	const newImage = {
		_id: id,
		link: link,
		caption: outfitType,
		imageName: imageName,
		username,
	};

	// Insert the new document into the outfitPieces collection
	const result = await outfitPiecesCollection.insertOne(newImage);

	// Check if the insertion was successful
	if (result.insertedId) {
		console.log("Image stored successfully");
		return result.insertedId;
	} else {
		throw new Error("Failed to store image");
	}
};

// stores a outfitpeice
await storeOutfitPiece(
	"711a24a197aa3b5a1c314701",
	"google.com",
	"shoes",
	shoes,
	"611a24a197aa3b5a1c314624"
);

//gets a shoe id
const outfitPiecesCollection = await outfitPieces();
const shoe = await outfitPiecesCollection.findOne({
	username: "611a24a197aa3b5a1c314624",
});
const shoe_id = shoe._id;

//creates a fitpost
const fitpost8 = {
	_id: "611a24a197aa3b5a1c314708",
	user_id: "611a24a197aa3b5a1c314624",
	postedDate: {
		$date: "2024-04-10T00:00:00.000Z",
	},
	headwear: "hat",
	bodywear: "612e08fd8ca3c9a1bc5831d2",
	legwear: "612e08fd8ca3c9a1bc5831d3",
	footwear: "612e08fd8ca3c9a1bc5831d4",
	footid: shoe_id,
	likes: 22,
	saves: 15,
};

//creates a wardrobe
const w1 = [
	fitpost8,
	{
		_id: "60e4c8fd25602e41d4b9271c",
		user_id: "60e4c8fd25602e41d4b9271d",
		postedDate: "2024-04-28T10:30:00Z",
		headwear: hat2,
		bodywear: tanktop,
		legwear: "joggers.jpg",
		footwear: "boots.jpg",
		likes: 75,
		saves: 30,
	},
];

//creates a second wardrobe
const w2 = [
	{
		_id: "60e4c8fd25602e41d4b9271a",
		user_id: "60e4c8fd25602e41d4b9271b",
		postedDate: "2024-04-27T08:00:00Z",
		headwear: hat3,
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
		headwear: hat4,
		bodywear: "hoodie.jpg",
		legwear: "joggers.jpg",
		footwear: "boots.jpg",
		likes: 75,
		saves: 30,
	},
];

await storeWardrobe("summer wardrobe", w1, "z");
await storeWardrobe("spring capsule", w2, "z");
await createFitpost(fitpost8);

//this is how to access a collection from another collection
const fitpostCollection = await fitposts();
const user_id = "611a24a197aa3b5a1c314624";
const cursor = await fitpostCollection.find({ user_id: user_id });

for (const doc of await cursor.toArray()) {
	const outfitPiecesCollection = await outfitPieces();
	const foot = await outfitPiecesCollection.findOne({
		_id: doc.footid,
	});
	console.log(
		`accessing outfit piece object attributes using id; currently accessing link: "${foot.link}"`
	);

	console.log("footwear id (outfit piece)", doc.footid);
	console.log("footwear image name", doc.footwear);
}
//leave bottom alone
console.log("Done seeding database");
await closeConnection();

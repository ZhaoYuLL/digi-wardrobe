import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import * as fp from "../data/fitposts.js";
import { fitposts } from "../config/mongoCollections.js";

import { generateFileName } from "../helper.js";

const db = await dbConnection();
await db.dropDatabase();

async function createFitpost(fitpost) {
	const fitpostCollection = await fitposts();
	const insertInfo = await fitpostCollection.insertOne(fitpost);
	if (insertInfo.insertedCount === 0) throw "Could not add fitpost";
	return insertInfo.insertedId;
}

const fitpost1 = {
	_id: "611a24a197aa3b5a1c314701",
	user_id: "611a24a197aa3b5a1c314619",
	postedDate: {
		$date: "2024-04-17T00:00:00.000Z",
	},
	headwear: "612e08fd8ca3c9a1bc5831d1",
	bodywear: "612e08fd8ca3c9a1bc5831d2",
	legwear: "612e08fd8ca3c9a1bc5831d3",
	footwear: "612e08fd8ca3c9a1bc5831d4",
	likes: 10,
	saves: 5,
};

const fitpost2 = {
	_id: "611a24a197aa3b5a1c314702",
	user_id: "611a24a197aa3b5a1c314619",
	postedDate: {
		$date: "2024-04-16T00:00:00.000Z",
	},
	headwear: "612e08fd8ca3c9a1bc5831d1",
	bodywear: "612e08fd8ca3c9a1bc5831d2",
	legwear: "612e08fd8ca3c9a1bc5831d3",
	footwear: "612e08fd8ca3c9a1bc5831d4",
	likes: 15,
	saves: 8,
};

const fitpost3 = {
	_id: "611a24a197aa3b5a1c314703",
	user_id: "611a24a197aa3b5a1c314619",
	postedDate: {
		$date: "2024-04-15T00:00:00.000Z",
	},
	headwear: "612e08fd8ca3c9a1bc5831d1",
	bodywear: "612e08fd8ca3c9a1bc5831d2",
	legwear: "612e08fd8ca3c9a1bc5831d3",
	footwear: "612e08fd8ca3c9a1bc5831d4",
	likes: 20,
	saves: 12,
};

const fitpost4 = {
	_id: "611a24a197aa3b5a1c314704",
	user_id: "611a24a197aa3b5a1c314619",
	postedDate: {
		$date: "2024-04-14T00:00:00.000Z",
	},
	headwear: "612e08fd8ca3c9a1bc5831d1",
	bodywear: "612e08fd8ca3c9a1bc5831d2",
	legwear: "612e08fd8ca3c9a1bc5831d3",
	footwear: "612e08fd8ca3c9a1bc5831d4",
	likes: 8,
	saves: 3,
};

const fitpost5 = {
	_id: "611a24a197aa3b5a1c314705",
	user_id: "611a24a197aa3b5a1c314619",
	postedDate: {
		$date: "2024-04-13T00:00:00.000Z",
	},
	headwear: "612e08fd8ca3c9a1bc5831d1",
	bodywear: "612e08fd8ca3c9a1bc5831d2",
	legwear: "612e08fd8ca3c9a1bc5831d3",
	footwear: "612e08fd8ca3c9a1bc5831d4",
	likes: 25,
	saves: 18,
};

const fitpost6 = {
	_id: "611a24a197aa3b5a1c314706",
	user_id: "611a24a197aa3b5a1c314624",
	postedDate: {
		$date: "2024-04-12T00:00:00.000Z",
	},
	headwear: "612e08fd8ca3c9a1bc5831d1",
	bodywear: "612e08fd8ca3c9a1bc5831d2",
	legwear: "612e08fd8ca3c9a1bc5831d3",
	footwear: "612e08fd8ca3c9a1bc5831d4",
	likes: 12,
	saves: 7,
};

const fitpost7 = {
	_id: "611a24a197aa3b5a1c314707",
	user_id: "611a24a197aa3b5a1c314624",
	postedDate: {
		$date: "2024-04-11T00:00:00.000Z",
	},
	headwear: "612e08fd8ca3c9a1bc5831d1",
	bodywear: "612e08fd8ca3c9a1bc5831d2",
	legwear: "612e08fd8ca3c9a1bc5831d3",
	footwear: "612e08fd8ca3c9a1bc5831d4",
	likes: 18,
	saves: 10,
};

const fitpost8 = {
	_id: "611a24a197aa3b5a1c314708",
	user_id: "611a24a197aa3b5a1c314624",
	postedDate: {
		$date: "2024-04-10T00:00:00.000Z",
	},
	headwear: "612e08fd8ca3c9a1bc5831d1",
	bodywear: "612e08fd8ca3c9a1bc5831d2",
	legwear: "612e08fd8ca3c9a1bc5831d3",
	footwear: "612e08fd8ca3c9a1bc5831d4",
	likes: 22,
	saves: 15,
};

const fitpost9 = {
	_id: "611a24a197aa3b5a1c314709",
	user_id: "611a24a197aa3b5a1c314624",
	postedDate: {
		$date: "2024-04-09T00:00:00.000Z",
	},
	headwear: "612e08fd8ca3c9a1bc5831d1",
	bodywear: "612e08fd8ca3c9a1bc5831d2",
	legwear: "612e08fd8ca3c9a1bc5831d3",
	footwear: "612e08fd8ca3c9a1bc5831d4",
	likes: 30,
	saves: 20,
};

const fitpost10 = {
	_id: "611a24a197aa3b5a1c314710",
	user_id: "611a24a197aa3b5a1c314624",
	postedDate: {
		$date: "2024-04-08T00:00:00.000Z",
	},
	headwear: "612e08fd8ca3c9a1bc5831d1",
	bodywear: "612e08fd8ca3c9a1bc5831d2",
	legwear: "612e08fd8ca3c9a1bc5831d3",
	footwear: "612e08fd8ca3c9a1bc5831d4",
	likes: 16,
	saves: 9,
};
await createFitpost(fitpost1);
await createFitpost(fitpost2);
await createFitpost(fitpost3);
await createFitpost(fitpost4);
await createFitpost(fitpost5);
await createFitpost(fitpost6);
await createFitpost(fitpost7);
await createFitpost(fitpost8);
await createFitpost(fitpost9);
await createFitpost(fitpost10);

//leave bottom alone
console.log("Done seeding database");
await closeConnection();

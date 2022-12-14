import express from "express";
import Place from "../models/placeModel.js";
import Hotel from "../models/hotelModel.js";
import Tour from "../models/tourModel.js";

import data from "../data/data.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  await Place.deleteMany({});
  const createdPlaces = await Place.insertMany(data.places);

  await Hotel.deleteMany({});
  const createdHotels = await Hotel.insertMany(data.hotels);

  await Tour.deleteMany({});
  const createdTours = await Tour.insertMany(data.tours);
  // await Users.remove({});
  // const createdUsers = await Users.insertMany(users);
  res.send({ createdPlaces, createdHotels, createdTours });
});
export default seedRouter;

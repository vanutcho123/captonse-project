import express from "express";
import Place from "../models/placeModel.js";
const placeRouter = express.Router();
import expressAsyncHandler from "express-async-handler";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

placeRouter.get("/", async (req, res) => {
  const places = await Place.find();
  res.send(places);
});

placeRouter.post(
  "/",
  auth,
  authAdmin,
  expressAsyncHandler(async (req, res) => {
    const {
      name,
      slug,
      title,
      category,
      image,
      district,
      rating,
      address,
      description,
      mapUrl,
    } = req.body;
    const placeExits = await Place.findOne({ name });
    if (placeExits) {
      res.status(400);
      throw new Error("Place already");
    } else {
      const place = new Place({
        name,
        slug,
        title,
        category,
        image,
        district,
        rating,
        address,
        description,
        mapUrl,
      });
      if (place) {
        const createdPlace = await place.save();
        res.status(201).json(createdPlace);
      } else {
        res.status(404);
        throw new Error("Invalid data");
      }
    }
  })
);

placeRouter.put(
  "/:id",
  auth,
  authAdmin,
  expressAsyncHandler(async (req, res) => {
    const {
      name,
      slug,
      title,
      category,
      image,
      district,
      rating,
      address,
      description,
      mapUrl,
    } = req.body;
    const place = await Place.findById(req.params.id);
    if (place) {
      place.name = name;
      place.slug = slug;
      place.title = title;
      place.category = category;
      place.image = image;
      place.district = district;
      place.rating = rating;
      place.address = address;
      place.description = description;
      place.mapUrl = mapUrl;

      const updatedPlace = await place.save();
      res.json(updatedPlace);
    } else {
      res.status(400);
      throw new Error("Invalid place data");
    }
  })
);

placeRouter.get(
  "/admin",
  auth,
  authAdmin,
  expressAsyncHandler(async (req, res) => {
    const places = await Place.find();
    const countPlaces = await Place.countDocuments();
    res.send({
      places,
      countPlaces,
    });
  })
);

placeRouter.delete(
  "/:id",
  auth,
  authAdmin,
  expressAsyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id);
    if (place) {
      await place.remove();
      res.send({ message: "Product Deleted" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

placeRouter.post(
  "/:id/reviews",
  auth,
  expressAsyncHandler(async (req, res) => {
    const placeId = req.params.id;
    const place = await Place.findById(placeId);
    if (place) {
      if (place.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
      }

      const review = {
        name: req.body.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      place.reviews.push(review);
      place.numReviews = place.reviews.length;
      place.rating =
        place.reviews.reduce((a, c) => c.rating + a, 0) / place.reviews.length;
      const updatedplace = await place.save();
      res.status(201).send({
        message: "Review Created",
        review: updatedplace.reviews[updatedplace.reviews.length - 1],
        numReviews: place.numReviews,
        rating: place.rating,
      });
    } else {
      res.status(404).send({ message: "Hai" });
    }
  })
);

placeRouter.delete("/:id/reviews/:commentId", auth, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    // Pull out comment
    const comment = place.reviews.find(
      (comment) => comment.id === req.params.id
    );
    console.log(comment);

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Check user
    if (comment.name.toString() !== req.user.name) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Get remove index
    const removeIndex = place.reviews
      .map((comment) => comment.name.toString())
      .indexOf(req.user.id);

    place.reviews.splice(removeIndex, 1);

    await place.save();

    res.json(place.reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

placeRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const keyword = req.query.keyword
      ? {
          $or: [
            {
              name: {
                $regex: req.query.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};
    const places = await Place.find({ ...keyword });
    res.send({ places });
  })
);

placeRouter.get(
  "/districts",
  expressAsyncHandler(async (req, res) => {
    const districts = await Place.find().distinct("district");
    res.send(districts);
  })
);
placeRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Place.find().distinct("category");
    res.send(categories);
  })
);
placeRouter.get("/slug/:slug", async (req, res) => {
  const place = await Place.findOne({ slug: req.params.slug });
  if (place) {
    res.send(place);
  } else {
    res.status(404).send({ message: "Không tìm thấy địa điểm!" });
  }
});
placeRouter.get("/:id", async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (place) {
    res.send(place);
  } else {
    res.status(404).send({ message: "Không tìm thấy địa điểm!" });
  }
});

export default placeRouter;

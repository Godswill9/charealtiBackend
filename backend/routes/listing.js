const express = require("express");
const { authenticate } = require("../config/verifyToken");
const {
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  postListing,
  getDonorsListings,
} = require("../controllers/listingController");
const route = express.Router();
const upload = require("../config/uploads");

//POST A LISTING
route.post(
  "/postListing",
  authenticate,
  upload.array("images", 4),
  postListing
);

route.get("/allListings", authenticate, getAllListings);

//getting a random listing
route.get("/listing/:id", authenticate, getListingById);

//getting a donors listings
route.get("/myListings/:id", authenticate, getDonorsListings);

route.put("/updateListing/:id", authenticate, updateListing);

route.delete("/deleteListing/:id", authenticate, deleteListing);

module.exports = route;

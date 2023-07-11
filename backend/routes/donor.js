const express = require("express");
const { authenticate } = require("../config/verifyToken");
const {
  getAlldonors,
  getDonorById,
  updateDonor,
  deleteDonor,
} = require("../controllers/donorController");
const route = express.Router();

route.get("/allDonors", authenticate, getAlldonors);

route.get("/donor/:id", authenticate, getDonorById);

route.put("/updateDonor/:id", authenticate, updateDonor);

route.delete("/deleteDonor/:id", authenticate, deleteDonor);

module.exports = route;

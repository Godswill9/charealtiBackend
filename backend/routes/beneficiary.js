const express = require("express");
const {
  getAllBeneficiaries,
  getBeneficiaryById,
  updateBeneficiary,
  deleteBeneficiary,
} = require("../controllers/beneficiaryController");
const { authenticate } = require("../config/verifyToken");
const route = express.Router();

route.get("/allBeneficiaries", authenticate, getAllBeneficiaries);

route.get("/beneficiary/:id", authenticate, getBeneficiaryById);

route.put("/updateBeneficiary/:id", authenticate, updateBeneficiary);

route.delete("/deleteBeneficiary/:id", authenticate, deleteBeneficiary);

module.exports = route;

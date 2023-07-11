//posting a listing
const { v4 } = require("uuid");
const database = require("../config/database");

//POSTING A LISTING
exports.postListing = async (req, res, next) => {
  const { productName, quantity, price, id, expirationDate, category } =
    req.body;
  const images = req.files.map((file) => file.path);
  const listingId = v4();
  const date = new Date();
  try {
    var createListing = `INSERT INTO all_listings (
      id,
      donor_id,
      item_name,
      item_availability, 
      price,
      quantity,
      created_at,
      updated_at,
      expiration_date,
      item_category) VALUES?`;
    var values = [
      [
        listingId,
        id,
        productName,
        "IN-STOCK",
        price,
        quantity,
        date,
        date,
        expirationDate,
        category,
      ],
    ];
    database.query(createListing, [values], (err, result) => {
      if (err) throw err;
    });

    // Insert the image paths into the MySQL database
    for (const imagePath of images) {
      var imgQuery =
        "INSERT INTO listing_images (listingId, imagePath) VALUES ?";
      var values = [[listingId, imagePath]];
      database.query(imgQuery, [values], (err, result) => {
        if (err) throw err;
      });
    }
    // Send a successful response
    res.status(201).json({ message: "Listing created successfully" });
  } catch (err) {
    next(err);
  }
};

// Get all Listings
exports.getAllListings = async (req, res, next) => {
  try {
    const query = "SELECT * FROM all_listings";
    database.query(query, (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no listings" });
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get a specific Listing by ID
exports.getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM all_listings WHERE id=?";
    await database.query(query, [id], (err, result) => {
      if (err) throw err;
      res.status(200).json(result);
    });
  } catch (err) {
    next(err);
  }
};
// Get a specific Listing by Donor ID
exports.getDonorsListings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM all_listings WHERE donor_id=?";
    await database.query(query, [id], (err, result) => {
      if (err) throw err;
      res.status(200).json(result);
    });
  } catch (err) {
    next(err);
  }
};

// Update a Listing
exports.updateListing = async (req, res, next) => {
  const { id } = req.params;
  const { name, availability, price, quantity, expirationDate, category } =
    req.body;
  const date = new Date();
  try {
    var query = `UPDATE all_listings SET name = ${name}, price=${price}, quantity=${quantity} WHERE id = '${id}';`;
    database.query(query, (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: "data updated", result: result });
    });
  } catch (err) {
    next(err);
  }
};

//delete Listing
exports.deleteListing = async (req, res, next) => {
  const { id } = req.params;
  try {
    var deleteQuery = `DELETE FROM all_listings WHERE id = '${id}'`;
    database.query(deleteQuery, (err, result) => {
      if (err) {
        console.error(err); // Log the error to the console
        res.status(500).send({ message: "An error occurred" });
      } else {
        console.log(result);
        res.send({ message: "deleted" });
      }
    });
  } catch (err) {
    next(err);
  }
};

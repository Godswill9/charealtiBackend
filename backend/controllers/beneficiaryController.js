const database = require("../config/database");

// Get all beneficiaries
exports.getAllBeneficiaries = async (req, res, next) => {
  try {
    const query = "SELECT * FROM all_beneficiaries";
    database.query(query, (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no beneficiaries" });
        console.log("no beneficiaries");
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// Get a specific beneficiary by ID
exports.getBeneficiaryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM all_beneficiaries WHERE id=?";
    database.query(query, [id], (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        res.send({ message: "no user with that id" });
      } else {
        res.json(result);
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update a beneficiary
exports.updateBeneficiary = async (req, res, next) => {
  const { id } = req.params;
  const { email, address } = req.body;
  try {
    var query = `UPDATE all_beneficiaries SET email = '${email}', address='${address}' WHERE id = '${id}';`;
    database.query(query, (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: "data updated" });
    });
  } catch (err) {
    next(err);
  }
};

//delete beneficiary
exports.deleteBeneficiary = async (req, res, next) => {
  const { id } = req.params;
  try {
    var deleteQuery = `DELETE FROM all_beneficiaries WHERE id = '${id}'`;
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

const database = require("./database");
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//signup
const signup = async (req, res, next) => {
  if (!req.body) {
    console.log("no body");
    return;
  }
  console.log(req.body);
  var userId = v4();
  // console.log(req.body)
  var date = new Date();
  var {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    nationality,
    userRole, //either donor or beneficiary or admin
    securityQuestion,
    securityAnswer,
    address,
  } = req.body;
  if (
    firstName == "" ||
    lastName == "" ||
    email == "" ||
    password == "" ||
    phoneNumber == "" ||
    nationality == "" ||
    userRole == "" ||
    securityQuestion == "" ||
    securityAnswer == "" ||
    address == ""
  ) {
    console.log("fill in all details");
    return;
  } else {
    var salt = await bcrypt.genSalt(10);
    if (!salt) {
      console.log("Error generating salt");
      return;
    }
    var hashed;
    try {
      hashed = await bcrypt.hash(password, salt);
    } catch (err) {
      console.log("Error hashing password:", err);
      return;
    }
    //CHECK FOR DONOR AND BENEFICIARY
    if (userRole == "BENEFICIARY") {
      var check = "SELECT * FROM all_beneficiaries WHERE email = ?";
      database.query(check, [email], (err, result) => {
        if (result.length !== 0) {
          console.log("user has registered with us");
          res.json({ message: "user already exists", redirect: "true" });
          return;
        } else {
          var createUser = `INSERT INTO all_beneficiaries (
             id,
             firstName,
             lastName, 
             email,
             password,
             phone, 
             created_at,
             updated_at,
             security_question,
             security_answer,
             nationality,
             wallet_balance,
             connects,
             dietary_restrictions,
             address) VALUES?`;
          var values = [
            [
              userId,
              firstName,
              lastName,
              email,
              hashed,
              phoneNumber,
              date,
              date,
              securityQuestion,
              securityAnswer,
              nationality,
              0,
              30,
              "",
              address,
            ],
          ];
          database.query(createUser, [values], (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send({ data: result, userRole: "BENEFICIARY" });
          });
        }
      });
    } else {
      var check = "SELECT * FROM all_donors WHERE email = ?";
      database.query(check, [email], (err, result) => {
        if (result.length !== 0) {
          console.log("user has registered with us");
          res.json({ message: "user already exists", redirect: "true" });
          return;
        } else {
          var createUser = `INSERT INTO all_donors (
             id,
             firstName,
             lastName, 
             email,
             password,
             phone, 
             created_at,
             updated_at,
             security_question,
             security_answer,
             nationality,
             wallet_balance,
             connects,
             address) VALUES?`;
          var values = [
            [
              userId,
              firstName,
              lastName,
              email,
              hashed,
              phoneNumber,
              date,
              date,
              securityQuestion,
              securityAnswer,
              nationality,
              0,
              30,
              address,
            ],
          ];
          database.query(createUser, [values], (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send({ message: "user registered", userRole: "DONOR" });
          });
        }
      });
    }
  }
};

//login
const login = async (req, res, next) => {
  var { email, password, userRole } = req.body;
  console.log(req.body);
  if (userRole == "BENEFICIARY") {
    var checkForUser = "SELECT * FROM all_beneficiaries WHERE email = ?";
    database.query(checkForUser, [email], async (err, result) => {
      if (result.length == 0) {
        console.log("user not found");
        res.json({ message: "user not found" });
      } else {
        console.log(result[0].password);
        await bcrypt.compare(password, result[0].password).then((resultt) => {
          if (!resultt) {
            console.log("incorrect password");
            res.json({ message: "incorrect password" });
          } else {
            const accessToken = jwt.sign(
              {
                email: result[0].email,
                id: result[0].id,
                firstName: result[0].firstName,
                lastName: result[0].lastName,
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "10d" }
            );
            res.cookie("jwt", accessToken, {
              maxAge: 3600 * 1000 * 24 * 365 * 100,
              withCredentials: true,
              httpOnly: true,
            });
            const allObj = {
              ...result[0],
              status: "success",
              redirect: "true",
              userRole: "BENEFICIARY",
            };
            res.json(allObj);
          }
        });
      }
    });
  } else {
    var checkForUser = "SELECT * FROM all_donors WHERE email = ?";
    database.query(checkForUser, [email], async (err, result) => {
      if (result.length == 0) {
        console.log("user not found");
        res.json({ message: "user not found" });
      } else {
        console.log(result[0].password);
        await bcrypt.compare(password, result[0].password).then((resultt) => {
          if (!resultt) {
            console.log("incorrect password");
            res.json({ message: "incorrect password" });
          } else {
            const accessToken = jwt.sign(
              {
                email: result[0].email,
                id: result[0].id,
                firstName: result[0].firstName,
                lastName: result[0].lastName,
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "10d" }
            );
            res.cookie("jwt", accessToken, {
              maxAge: 3600 * 1000 * 24 * 365 * 100,
              withCredentials: true,
              httpOnly: true,
            });
            const allObj = {
              ...result[0],
              status: "success",
              redirect: "true",
              userRole: "DONOR",
            };
            res.json(allObj);
          }
        });
      }
    });
  }
};

module.exports = { signup, login };

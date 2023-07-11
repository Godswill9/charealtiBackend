require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require("./config/database");
const beneficiaries = require("./routes/beneficiary");
const donors = require("./routes/donor");
const listings = require("./routes/listing");
const login = require("./routes/login");
const signup = require("./routes/signup");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("welcome to charealti backend system...");
});

app.use("/api", signup);
app.use("/api", login);
app.use("/api", beneficiaries);
app.use("/api", donors);
app.use("/api", listings);

const port = process.env.PORT || 3000;
console.log(new Date());

server.listen(port, () => {
  console.log("Server is running on port", port);
});

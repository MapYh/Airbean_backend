const express = require("express");
const { aboutText } = require("./database.js"); // Om aboutText används någonstans, annars kan du ta bort det här också.
const login = require("./login.js");
const signup = require("./signup.js");
const order = require("./order.js");
const about = require("./about.js");
const beans = require('./beans.js');

// Init app
const app = express();

/*--------------Middleware--------------- */
app.use(express.json());
app.use("/auth", login); // använd http://127.0.0.1:8000/auth/"endpoint"
app.use("/join", signup); // använd http://127.0.0.1:8000/join/"endpoint"
app.use("/order", order); // för att komma åt använd http://127.0.0.1:8000/orders/"endpoint"
app.use("/about", about); // för att komma åt använd http://127.0.0.1:8000/about/"endpoint"
app.use('/beans', beans); // för att komma åt använd http://127.0.0.1:8000/beans/"endpoint"

/*--------------Variables--------------- */
const PORT = 8000;
const URL = "127.0.0.1";

// Init en ny databas

/*--------------GET--------------- */
app.get("/", (req, res) => {
  res.status(200).json({ message: "testing" });
});

app.get("/user/product", (req, res) => {});

app.listen(PORT, URL, () => {
  console.log(`Server running on: ${URL}:${PORT}`);
});

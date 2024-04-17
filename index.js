const express = require("express");
const { beansMenu, aboutText } = require("./database.js");
const login = require("./login.js");
const signup = require("./signup.js");
const order = require("./order.js");
const about = require("./about.js");

//Init app
const app = express();
/*--------------Middleware--------------- */
app.use(express.json());
app.use("/auth", login); //använd http://127.0.0.1:8000/auth/"endpoint"
app.use("/join", signup); //använd http://127.0.0.1:8000/join/"endpoint"
app.use("/order", order); //för att komma åt använd http://127.0.0.1:8000/orders/"endpoint"
app.use("/about", about); //för att komma åt använd http://127.0.0.1:8000/about/"endpoint"
/*--------------Variables--------------- */

const PORT = 8000;
const URL = "127.0.0.1";
const menuData = require("./model/menu.json");

//init en ny databas

/*--------------GET--------------- */
app.get("/", (req, res) => {
  res.status(200).json({ message: "testing" });
});

app.get("/beans", async (req, res) => {
  try {
    const beans = await beansMenu.find({});
    //Vet ej hur han vill att vi hämtar datan. Alltingen så eller så bytes "menuData" ut mot "beans"
    res.status(201).json(menuData);
  } catch (error) {
    res.status(500).json({ message: "internal server error!" });
  }
});

app.get("/user/product", (req, res) => {});

app.listen(PORT, URL, () => {
  console.log(`Server running on: ${URL}:${PORT}`);
});

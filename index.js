const express = require("express");
const Datastore = require("nedb-promise")


//Init app
const app = express();
/*--------------Middleware--------------- */
app.use(express.json());

/*--------------Variables--------------- */

const PORT = 8000;
const URL = "127.0.0.1";
const menuData = require("./model/menu.json");


//init en ny databas
const beansMenu = new Datastore({filename: "./model/menu.db", autoload: true});


/*--------------GET--------------- */
app.get("/", (req, res) => {
  res.status(200).json({message: "testing"});
});

app.get("/beans", async (req, res) => {
  
  try {
    
    const beans = await beansMenu.find({});
    //Vet ej hur han vill att vi hämtar datan. Alltingen så eller så bytes "menuData" ut mot "beans" 
    res.status(201).json(menuData);
    
  } catch (error) {
    res.status(500).json({message: "internal server error!"})
  }
})

app.get("/user/product", (req, res) => {});

app.listen(PORT, URL, () => {
  console.log(`Server running on: ${URL}:${PORT}`);
});
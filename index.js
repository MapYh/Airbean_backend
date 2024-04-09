import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Datastore from "nedb";

//Init app
const app = express();

let db = new Datastore({ filename: "/menu.json", autoload: true });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/*--------------Middleware--------------- */
app.use(express.json());
app.use(express.static(__dirname));

/*--------------Variables--------------- */

const PORT = 8000;
const URL = "127.0.0.1";

/*--------------GET--------------- */
app.get("/", (req, res) => {});

app.get("/products", (req, res) => {
  const products = req.body;
  db.insert(products);
  res.send(products);
});

app.listen(PORT, URL, () => {
  console.log(`Server running on: ${URL}:${PORT}`);
});

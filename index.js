import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

//Init app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/*--------------Middleware--------------- */
app.use(express.json());
app.use(express.static(__dirname));

/*--------------Variables--------------- */

const PORT = 8000;
const URL = "127.0.0.1";

/*--------------GET--------------- */
app.get("/", (req, res) => {
  res.sendFile("./page.html", { root: __dirname });
});

app.get("/user/product", (req, res) => {});

app.listen(PORT, URL, () => {
  console.log(`Server running on: ${URL}:${PORT}`);
});

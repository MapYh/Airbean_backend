const express = require("express");
const Datastore = require("nedb-promise");
const { body, validationResult, checkSchema } = require("express-validator");
const menu = require("./model/menu.json");

const order = express();
order.use(express.json());

const orderData = new Datastore({
  filename: "./model/orders.db",
  autoload: true,
});

const userData = new Datastore({
  filename: "./model/users.db",
  autoload: true,
});

order.get("/orders", async (req, res) => {
  try {
    const allOrders = await orderData.find({});
    res.status(201).json(allOrders);
  } catch (error) {
    res.status(500).json({ message: "internal server error!" });
  }
});

order.post(
  "/:id/orders",
  //Validering av request input kollar så att all data har rätt format.
  body("orderId").isString(),
  body("orders.*.id").isInt(),
  body("orders.*.title").isString(),
  body("orders.*.desc").isString(),
  body("orders.*.price").isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(404)
        .json({ message: "body contained wrong value types." });
    }

    const id = req.params.id;
    const { orderId, orders } = req.body;
    const newOrder = { orderId, orders };

    //validering så att inga extra keys kommer med i request body.
    const validatedBody = await Object.keys(req.body).filter(
      (key) => !["orderId", "orders"].includes(key)
    );

    if (validatedBody.length > 0) {
      return res.status(404).json({ message: "body contained wrong values" });
    }

    ///----------------------------
    //Kvar att implementera, kod som jämför så att alla keys har
    //rätt värde enligt menu.json filen.
    const foundUser = await userData.findOne({ _id: id });
    try {
      foundUser.orders.push(newOrder);

      userData.update({ _id: id }, { $set: { orders: foundUser.orders } });
      orderData.insert(newOrder);
      res.status(201).json("The order has been added to your user file.");
    } catch (error) {
      res.status(500).json({ message: "internal server error!" });
    }
  }
);

module.exports = order;

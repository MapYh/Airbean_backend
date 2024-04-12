const express = require("express");
const Datastore = require("nedb-promise");
/* const { v4: uuidv4 } = require("uuid"); */
const { body, validationResult, checkSchema } = require("express-validator");

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
    console.log("Errors: ", errors);
    //validering.
    /* const validatedBody = await Object.keys(req.body).filter(
      (key) => !["orderId", "orders"].includes(key)
    );
    console.log("Validated", orders[0].id);
    if (validatedBody.length > 0) {
      return res.status(404).json({ message: "body contained wrong values" });
    } */

    const id = req.params.id;
    const { orderId, orders } = req.body;
    const newOrder = { orderId, orders };

    ///----------------------------

    const foundUser = await userData.findOne({ _id: id });
    try {
      foundUser.orders.push(newOrder);

      userData.update({ _id: id }, { $set: { orders: foundUser.orders } });
      orderData.insert(newOrder);
      res.status(201).json("true");
    } catch (error) {
      res.status(500).json({ message: "internal server error!" });
    }
  }
);

module.exports = order;

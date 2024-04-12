const express = require("express");
const Datastore = require("nedb-promise");

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

order.post("/:id/orders", async (req, res) => {
  const id = req.params.id;
  const { orderId, order } = req.body;
  const newOrder = { orderId, order };
  console.log("1", newOrder);
  const foundUser = await userData.findOne({ _id: id });
  console.log("2", foundUser);
  try {
    foundUser.orders.push(newOrder);

    userData.update({ _id: id }, { $set: { orders: foundUser.orders } });
    orderData.insert(newOrder);
    console.log(userData);
    res.status(201).json("true");
  } catch (error) {
    res.status(500).json({ message: "internal server error!" });
  }
});

module.exports = order;

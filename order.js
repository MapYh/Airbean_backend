const express = require("express");
const Datastore = require("nedb-promise");

app.get("/user/:id/order", (req, res) => {
  const order = req.body;
  res.status(201).json(order);
});
app.post("/user/:id/order", async (req, res) => {
  const { price, title, id } = req.body;
  const newOrder = { price, title, id };
  try {
    const allUserOrders = await userOrder.insert(newOrder);
    res.status(201).json(allUserOrders);
  } catch (error) {
    res.status(500).json({ message: "internal server error!" });
  }
});

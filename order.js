const express = require("express");
const Datastore = require("nedb-promise");
const { body, validationResult } = require("express-validator");
const Menu = require("./model/menu.json");

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
    //Alla errors syns nedan.
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

    //Kontrollerar så att alla värden som skickas med i begäran, faktist finns att beställa i menyn.
    let resultFinal = [];
    for (let i = 0; i < newOrder.orders.length; i++) {
      for (let j = 0; j < Menu.menu.length; j++) {
        const resultId = newOrder.orders[i].id == Menu.menu[j].id;
        const resultTitle = newOrder.orders[i].title == Menu.menu[j].title;
        const resultDesc = newOrder.orders[i].desc == Menu.menu[j].desc;
        const resultPrice = newOrder.orders[i].price == Menu.menu[j].price;
        if (resultId && resultTitle && resultDesc && resultPrice) {
          resultFinal.push(true);
        }
      }
    }

    const foundUser = await userData.findOne({ _id: id });
    try {
      if (!(foundUser == null)) {
        foundUser.orders.push(newOrder);
        if (resultFinal.length == newOrder.orders.length) {
          userData.update({ _id: id }, { $set: { orders: foundUser.orders } });
          orderData.insert(newOrder);
          res.status(201).json("The order has been added to your user file.");
        } else {
          res
            .status(500)
            .json({ message: "Something is wrong with the request body!" });
        }
      } else {
        res.status(500).json({ message: "No user with that id!" });
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error!" });
    }
  }
);

module.exports = order;

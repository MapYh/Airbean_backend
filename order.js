const express = require("express");
const {userData, orderData} = require("./database");
const { body, validationResult } = require("express-validator");
const {getRandomNumber} = require("./util/Randometa");
const Menu = require("./model/menu.json");

const order = express();
order.use(express.json());


order.get("/orders", async (req, res) => {
  try {
    const allOrders = await orderData.find({});
    res.status(201).json(allOrders);
  } catch (error) {
    res.status(500).json({ message: "internal server error!" });
  }
});

order.post(
  "/:id?/orders",
  //Validering av request input kollar så att all data har rätt format.
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
    const { orders } = req.body;
    const newOrder = orders;

    //validering så att inga extra keys kommer med i request body.
    const validatedBody = await Object.keys(req.body).filter(
      (key) => !["orders"].includes(key)
    );

    if (validatedBody.length > 0) {
      return res.status(404).json({ message: "body contained wrong values" });
    }

    //Kontrollerar så att alla värden som skickas med i begäran, faktist finns att beställa i menyn.
    let resultFinal = false;
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < Menu.menu.length; j++) {
        const resultId = orders[i].id == Menu.menu[j].id;
        const resultTitle = orders[i].title == Menu.menu[j].title;
        const resultDesc = orders[i].desc == Menu.menu[j].desc;
        const resultPrice = orders[i].price == Menu.menu[j].price;
        if (resultId && resultTitle && resultDesc && resultPrice) {
          resultFinal = true
        }
      }
    }

    //Letar efter en anvndare med id i begäran.
    const foundUser = await userData.findOne({ _id: id });
    try {
      //Om  det finns en användare skriv in beställningen till den användaren.
      if (!(foundUser == null)) {
        foundUser.orders.push({orderId: id, ...newOrder});
        if (resultFinal) {
          await userData.update({ _id: id }, { $set: { orders: foundUser.orders } });
          await orderData.insert({orderId: id, ...newOrder});
          res.status(201).json("The order has been added to your user file.");
        } else {
          res
            .status(500)
            .json({ message: "Something is wrong with the request body!" });
        }
        //Om det inte finns en användare med det rätta id, skickas ett felmeddelande.
      }else if(!foundUser){
        const insertedOrder = await orderData.insert(newOrder);
        console.log("orderID", insertedOrder._id)
        res.status(200).json({eta: getRandomNumber(15,100)});
      }else {
        res.status(500).json({ message: "No user with that id!" });
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error!" });
    }
  }
);

module.exports = order;

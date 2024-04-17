const express = require("express");
const {userData} = require("./database");
const { v4: uuidv4 } = require("uuid");

const signup = express();

signup.use(express.json());

signup.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const newUser = { email, password, name };
  console.log(newUser);
  //Validering. Kollar om några extra keys förutom dom bestämda smyger med
  const validateBody = await Object.keys(req.body).filter(
    (key) => !["email", "password", "name"].includes(key)
  );
  if (validateBody.length > 0) {
    return res.status(404).json({ message: "body contained wrong values" });
  }

  try {
    if (!newUser) {
      return res.status(404).json({ message: "something went wrong!" });
    } else {
      const user = await userData.insert({
        _id: uuidv4(),
        ...newUser,
        orders: [],
      });
      return res
        .status(201)
        .json({ message: `Added new user! ${newUser.name}` });
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error!" });
  }
});

module.exports = signup;

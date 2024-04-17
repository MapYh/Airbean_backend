const express = require("express");
const {userData} = require("./database");

const login = express();

login.use(express.json());


login.get("/users", async (req, res) => {
  try {
    const users = await userData.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "internal server error!" });
  }
});

//Login handler
login.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await userData.findOne({email: email, password: password});
        if(!user){
            return res.status(404).json({ message: "Login attempt failed"})
        }
        return res.status(200).json({ message: `Welcome Mr ${user.name}. Your ID is ${user._id}` });

    } catch (error) {
        res.status(500).json({ message: "internal server error!" });
    }
})


module.exports = login;

const express = require("express");
const Datastore = require("nedb-promise");
const { v4: uuidv4 } = require('uuid');


const signup = express();

signup.use(express.json());

 const usersData = new Datastore({filename: "./model/users.db", autoload: true});

signup.get("/testsign", (req, res) => {
    res.status(200).json({message: "Signup test!"})
})   

signup.get("/testuser", async (req, res) => {
    const user = await usersData.find({})
    res.status(200).json(user)
})   

signup.post("/signup", async (req, res) => {
    const {email, password, name} = req.body;
    const newUser = {email, password, name};
    console.log(newUser)

    try {
        if(!newUser) {
            return res.status(404).json({message: "something went wrong!" })
         }else{
             const user = await usersData.insert({_id: uuidv4(), ...newUser, orders: []});
             return res.status(201).json({message: `Added new user! ${newUser.name}`})
         }
    } catch (error) {
        res.status(500).json({ message: "internal server error!" });
    }

})


module.exports = signup;
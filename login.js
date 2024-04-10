const express = require("express");
const Datastore = require("nedb-promise");

const login = express();

login.use(express.json());

// const usersData = new Datastore({filename: "/model/users.db", autoload: true});
const users = [
    {email: "horseman@hotmale.com", password: "horse", id: 2, orders: [], name: "Horse"},
    {email: "catman@hotmale.com", password: "cat", id: 3, orders: [], name: "Cat"},
    {email: "dogman@hotmale.com", password: "dog", id: 1, orders: [], name: "Dog"},

]

login.get("/users", async (req, res) => {
    try {
        //const users = await usersData.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "internal server error!" });
    }
    
} );

//Login handler
login.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await users.find(user => user.email === email && user.password === password);
        if(!user){
            return res.status(404).json({ message: "Login attempt failed"})
        }
        return res.status(200).json({ message: `Welcome Mr ${user.name}` });

    } catch (error) {
        res.status(500).json({ message: "internal server error!" });
    }
})


module.exports = login;
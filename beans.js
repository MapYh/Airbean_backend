const express = require('express');
const router = express.Router();
const { beansMenu } = require('./database.js'); 
// const Menu = require("./model/menu.json");

router.get('/products', async (req, res) => {
  try {
    const beans = await beansMenu.find({});
    res.status(201).json(beans); 
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

module.exports = router;
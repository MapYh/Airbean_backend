const express = require("express");
const router = express.Router();
const { aboutText } = require("./database.js"); // justera sökvägen efter behov

router.get("/", async (req, res) => {
  try {
    const aboutInformation = await aboutText.find({});
    res.status(201).json(aboutInformation);
  } catch (error) {
    res.status(500).json({ message: "internal server error!" });
  }
});

module.exports = router;

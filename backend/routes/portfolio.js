const express = require("express");
const router = express.Router();

let userPortfolio;

module.exports = (up) => {
  userPortfolio = up;
  return router;
};

router.post("/", (req, res) => {
  const { stocks } = req.body;
  if (!stocks || !Array.isArray(stocks)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid array of stock symbols",
    });
  }
  userPortfolio.length = 0;
  stocks.forEach((stock) => userPortfolio.push(stock.toString().toUpperCase()));
  res.json({
    success: true,
    message: "Portfolio updated successfully",
    portfolio: userPortfolio,
  });
});

router.get("/", (req, res) => {
  res.json({
    success: true,
    portfolio: userPortfolio,
  });
});

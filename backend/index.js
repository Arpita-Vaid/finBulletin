const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

let userPortfolio = [];
let newsHeadlines = [];
let filteredHeadlines = [];

const portfolioRouter = require("./routes/portfolio")(userPortfolio);
app.use("/api/portfolio", portfolioRouter);

const newsRouter = require("./routes/news")(newsHeadlines, userPortfolio, filteredHeadlines);
app.use("/api/news", newsRouter);

const analysisRouter = require("./routes/analysis")(filteredHeadlines, userPortfolio);
app.use("/api/analysis", analysisRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Stock Market News API",
    version: "1.0.0",
    endpoints: {
      "GET /api/news/general": "Get all scraped news headlines",
      "POST /api/portfolio": "Set user portfolio (stocks array)",
      "GET /api/portfolio": "Get current portfolio",
      "GET /api/news/portfolio": "Get filtered news for portfolio",
      "POST /api/news/analyze": "Analyze sentiment (mock)"
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for API documentation`);
});

module.exports = app;

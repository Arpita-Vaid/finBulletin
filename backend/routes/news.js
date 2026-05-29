const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

let newsHeadlines;
let userPortfolio;
let filteredHeadlines;

module.exports = (nh, up, fh) => {
  newsHeadlines = nh;
  userPortfolio = up;
  filteredHeadlines = fh;
  return router;
};

// Fallback mock data when scraping fails
function getMockNews() {
  return [
    {
      title: "TCS Q3 Results Beat Estimates, Stock Gains 2%",
      url: "https://economictimes.indiatimes.com/",
      timestamp: new Date().toISOString(),
      source: "Economic Times"
    },
    {
      title: "Infosys Partners with Global Tech Company for Cloud Services",
      url: "https://www.moneycontrol.com/",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      source: "Moneycontrol"
    },
    {
      title: "Bajaj Auto Reports Strong Growth in Domestic Sales",
      url: "https://www.livemint.com/",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      source: "Livemint"
    },
    {
      title: "RIL Announces New Renewable Energy Projects",
      url: "https://www.business-standard.com/",
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      source: "Business Standard"
    },
    {
      title: "Banking Sector Shows Resilience Amid Market Volatility",
      url: "https://www.financialexpress.com/",
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      source: "Financial Express"
    }
  ];
}

async function scrapeNews() {
  const allHeadlines = [];
  let anySuccess = false;

  try {
    const etResponse = await axios.get("https://economictimes.indiatimes.com/markets", {
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    const $et = cheerio.load(etResponse.data);
    $et("h2, h3, .eachStory h3, .story-box h3").each((i, el) => {
      if (i >= 10) return false;
      const title = $et(el).text().trim();
      const link = $et(el).find("a").attr("href") || $et(el).parent().find("a").attr("href");
      if (title && title.length > 20) {
        allHeadlines.push({
          title,
          url: link ? link.startsWith("http") ? link : `https://economictimes.indiatimes.com${link}` : null,
          timestamp: new Date().toISOString(),
          source: "Economic Times"
        });
      }
    });
    anySuccess = true;
  } catch (e) {
    console.error("Economic Times scraping failed:", e.message);
  }

  try {
    const mcResponse = await axios.get("https://www.moneycontrol.com/news/business/markets/", {
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    const $mc = cheerio.load(mcResponse.data);
    $mc(".clearfix .article_list .clearfix").each((i, el) => {
      if (i >= 10) return false;
      const title = $mc(el).find("h2, h3, a").text().trim();
      const link = $mc(el).find("a").attr("href");
      if (title && title.length > 20) {
        allHeadlines.push({
          title,
          url: link || null,
          timestamp: new Date().toISOString(),
          source: "Moneycontrol"
        });
      }
    });
    anySuccess = true;
  } catch (e) {
    console.error("Moneycontrol scraping failed:", e.message);
  }

  try {
    const lmResponse = await axios.get("https://www.livemint.com/market", {
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    const $lm = cheerio.load(lmResponse.data);
    $lm(".headline, h2, h3, .listingPage h2").each((i, el) => {
      if (i >= 10) return false;
      const title = $lm(el).text().trim();
      const link = $lm(el).find("a").attr("href");
      if (title && title.length > 20) {
        allHeadlines.push({
          title,
          url: link ? link.startsWith("http") ? link : `https://www.livemint.com${link}` : null,
          timestamp: new Date().toISOString(),
          source: "Livemint"
        });
      }
    });
    anySuccess = true;
  } catch (e) {
    console.error("Livemint scraping failed:", e.message);
  }

  try {
    const bsResponse = await axios.get("https://www.business-standard.com/markets", {
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    const $bs = cheerio.load(bsResponse.data);
    $bs(".listing-txt, h2, h3").each((i, el) => {
      if (i >= 10) return false;
      const title = $bs(el).text().trim();
      const link = $bs(el).find("a").attr("href");
      if (title && title.length > 20) {
        allHeadlines.push({
          title,
          url: link ? link.startsWith("http") ? link : `https://www.business-standard.com${link}` : null,
          timestamp: new Date().toISOString(),
          source: "Business Standard"
        });
      }
    });
    anySuccess = true;
  } catch (e) {
    console.error("Business Standard scraping failed:", e.message);
  }

  try {
    const feResponse = await axios.get("https://www.financialexpress.com/market/", {
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    const $fe = cheerio.load(feResponse.data);
    $fe(".listitembx h3, h2, h3").each((i, el) => {
      if (i >= 10) return false;
      const title = $fe(el).text().trim();
      const link = $fe(el).find("a").attr("href");
      if (title && title.length > 20) {
        allHeadlines.push({
          title,
          url: link ? link.startsWith("http") ? link : `https://www.financialexpress.com${link}` : null,
          timestamp: new Date().toISOString(),
          source: "Financial Express"
        });
      }
    });
    anySuccess = true;
  } catch (e) {
    console.error("Financial Express scraping failed:", e.message);
  }

  if (!anySuccess || allHeadlines.length === 0) {
    console.warn("News scraping failed, using fallback mock data");
    const mockData = getMockNews();
    newsHeadlines.splice(0, newsHeadlines.length, ...mockData);
    return mockData;
  }
  const seen = new Set();
  const dedupedHeadlines = allHeadlines.filter(h => {
    const key = h.title + '|' + h.source;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  newsHeadlines.splice(0, newsHeadlines.length, ...dedupedHeadlines);
  return dedupedHeadlines;
}

router.get("/general", async (req, res) => {
  try {
    await scrapeNews();
    return res.json({
      success: true,
      count: newsHeadlines.length,
      data: newsHeadlines
    });
  } catch (error) {
    console.error("News scraping error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch news from all sources",
      data: []
    });
  }
});

router.get("/portfolio", (req, res) => {
  if (!userPortfolio || userPortfolio.length === 0) {
    return res.json({
      success: false,
      message: "No portfolio found. Please add stocks to your portfolio first.",
      data: []
    });
  }
  if (!newsHeadlines) {
    return res.status(500).json({
      success: false,
      message: "News headlines not initialized.",
      data: []
    });
  }
  const filteredNews = newsHeadlines.filter((headline) => {
    const title = headline.title.toUpperCase();
    return userPortfolio.some((stock) => title.includes(stock));
  });
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const recentNews = filteredNews.filter((item) => {
    const newsTime = new Date(item.timestamp).getTime();
    return now - newsTime <= oneDayMs;
  });
  filteredHeadlines.length = 0;
  recentNews.forEach((item) => filteredHeadlines.push(item));
  res.json({
    success: true,
    count: recentNews.length,
    portfolio: userPortfolio,
    data: recentNews
  });
});

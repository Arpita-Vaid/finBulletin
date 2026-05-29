const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

let filteredHeadlines;
let userPortfolio;

module.exports = (fh, up) => {
  filteredHeadlines = fh;
  userPortfolio = up;
  return router;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildSentimentPrompt(stocks, headlines) {
  return `Given the following stock symbols: ${stocks.join(", ")}
And these news headlines (with source and timestamp):\n${headlines
    .map((h) => `- [${h.source}] ${h.title} (${h.timestamp})`)
    .join("\n")}

Analyze the sentiment for each stock based on the news. For each stock, return a JSON object in this format:
{
  "SYMBOL": {
    "sentiment": "Positive|Negative|Neutral",
    "confidence": <number between 0 and 1>,
    "reason": "Short explanation based on the news headlines or 'No relevant news found' if not present."
  },
  ...
}
If a stock does not appear in any headline, return 'Neutral' sentiment, low confidence (e.g. 0.1), and reason 'No relevant news found'. Only include stocks from the portfolio. Be concise and accurate.`;
}

function generateMockSentiment(stocks, headlines) {
  const result = {};
  const sentiments = ["Positive", "Neutral", "Negative"];
  
  stocks.forEach((stock) => {
    const relevantHeadlines = headlines.filter(h => h.title.toUpperCase().includes(stock));
    let sentiment = "Neutral";
    let confidence = 0.5;
    let reason = "No relevant news found";
    
    if (relevantHeadlines.length > 0) {
      const positiveKeywords = ["gain", "growth", "strong", "rise", "up", "boost", "surge", "beat"];
      const negativeKeywords = ["loss", "fall", "decline", "down", "drop", "weakness", "miss", "sell"];
      
      const titleText = relevantHeadlines.map(h => h.title.toLowerCase()).join(" ");
      const positiveCount = positiveKeywords.filter(kw => titleText.includes(kw)).length;
      const negativeCount = negativeKeywords.filter(kw => titleText.includes(kw)).length;
      
      if (positiveCount > negativeCount) {
        sentiment = "Positive";
        confidence = Math.min(0.9, 0.5 + positiveCount * 0.15);
      } else if (negativeCount > positiveCount) {
        sentiment = "Negative";
        confidence = Math.min(0.9, 0.5 + negativeCount * 0.15);
      } else {
        sentiment = "Neutral";
        confidence = 0.6;
      }
      
      reason = `Based on ${relevantHeadlines.length} relevant headline(s). ${relevantHeadlines[0].title}`;
    }
    
    result[stock] = {
      sentiment,
      confidence: Math.round(confidence * 100) / 100,
      reason
    };
  });
  
  return result;
}

router.get("/", async (req, res) => {
  const stocks = userPortfolio || [];
  const headlines = filteredHeadlines || [];
  if (!stocks.length || !headlines.length) {
    return res.status(400).json({
      success: false,
      message: "No stocks or news headlines available for analysis.",
    });
  }
  
  // Try to use Gemini AI if API key is available
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_api_key_here") {
    try {
      const prompt = buildSentimentPrompt(stocks, headlines);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
      return res.json({
        success: true,
        result: JSON.parse(cleanedText),
      });
    } catch (error) {
      console.warn("Gemini API failed, using fallback mock sentiment:", error.message);
    }
  }
  
  // Fallback to mock sentiment analysis
  try {
    const mockResult = generateMockSentiment(stocks, headlines);
    return res.json({
      success: true,
      result: mockResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze sentiment",
    });
  }
});

import { useState, useEffect } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import GeneralNews from "./GeneralNews";
import PortfolioInput from "./PortfolioInput";
import SentimentAnalysis from "./SentimentAnalysis";
import "./StockUpdates.css";

function StockUpdates({ portfolio, setPortfolio, onNewsLoaded }) {
  const [portfolioValue, setPortfolioValue] = useState(() => {
    const saved = localStorage.getItem("portfolioPerformance");
    return saved ? JSON.parse(saved) : { holdings: {}, totalCurrent: 0, totalInvested: 0 };
  });

  const [activeTab, setActiveTab] = useState("news");

  const holdingsArray = Object.entries(portfolioValue.holdings || {});
  const totalGainLoss = portfolioValue.totalCurrent - portfolioValue.totalInvested;
  const totalGainLossPercent = portfolioValue.totalInvested > 0
    ? ((totalGainLoss / portfolioValue.totalInvested) * 100).toFixed(2)
    : 0;

  return (
    <div className="stock-updates-container">
      <Card>
        <SectionTitle>📱 Stock Updates Hub</SectionTitle>
        <p className="updates-subtitle">
          Real-time market news, portfolio tracking, and AI sentiment analysis
        </p>
      </Card>

      <div className="updates-tabs">
        <button
          className={`updates-tab ${activeTab === "news" ? "active" : ""}`}
          onClick={() => setActiveTab("news")}
        >
          📰 Market News
        </button>
        <button
          className={`updates-tab ${activeTab === "portfolio" ? "active" : ""}`}
          onClick={() => setActiveTab("portfolio")}
        >
          💼 My Portfolio
        </button>
        <button
          className={`updates-tab ${activeTab === "sentiment" ? "active" : ""}`}
          onClick={() => setActiveTab("sentiment")}
        >
          🤖 AI Sentiment
        </button>
        <button
          className={`updates-tab ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          ➕ Add Stock
        </button>
      </div>

      {activeTab === "news" && (
        <div className="tab-content">
          <Card>
            <SectionTitle>📰 General Market News</SectionTitle>
            <p className="tab-description">
              Stay updated with the latest market news and trends affecting your stocks
            </p>
          </Card>
          <GeneralNews onNewsLoaded={onNewsLoaded} />
        </div>
      )}

      {activeTab === "portfolio" && (
        <div className="tab-content">
          <Card>
            <SectionTitle>💼 Your Stock Portfolio</SectionTitle>
            <p className="tab-description">
              Monitor your current holdings and investment performance
            </p>

            {holdingsArray.length === 0 ? (
              <div className="empty-portfolio">
                <p className="empty-icon">📊</p>
                <p className="empty-text">No stocks in your portfolio yet.</p>
                <p className="empty-hint">Go to "Add Stock" tab to get started!</p>
              </div>
            ) : (
              <>
                <div className="portfolio-summary">
                  <div className="summary-card">
                    <span className="summary-label">Total Invested</span>
                    <span className="summary-value">
                      ₹{portfolioValue.totalInvested.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Current Value</span>
                    <span className="summary-value">
                      ₹{portfolioValue.totalCurrent.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className={`summary-card ${totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
                    <span className="summary-label">Total Gain/Loss</span>
                    <span className="summary-value">
                      {totalGainLoss >= 0 ? '📈' : '📉'} ₹{Math.abs(totalGainLoss).toLocaleString('en-IN')}
                    </span>
                    <span className="summary-percent">({totalGainLossPercent}%)</span>
                  </div>
                </div>

                <div className="holdings-showcase">
                  <h3>Your Holdings:</h3>
                  <div className="holdings-cards">
                    {holdingsArray.map(([symbol, data]) => {
                      const gainLoss = data.currentValue - data.costBasis;
                      const gainLossPercent = ((gainLoss / data.costBasis) * 100).toFixed(2);
                      const isPositive = gainLoss >= 0;

                      return (
                        <div key={symbol} className={`holding-showcase ${isPositive ? 'positive' : 'negative'}`}>
                          <div className="holding-icon">{isPositive ? '📈' : '📉'}</div>
                          <h4>{symbol}</h4>
                          <div className="holding-stat">
                            <span className="stat-label">Quantity:</span>
                            <span className="stat-value">{data.quantity} shares</span>
                          </div>
                          <div className="holding-stat">
                            <span className="stat-label">Avg Cost:</span>
                            <span className="stat-value">₹{data.buyPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="holding-stat">
                            <span className="stat-label">Current:</span>
                            <span className="stat-value">₹{data.currentPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="holding-pl">
                            <span className={isPositive ? 'positive' : 'negative'}>
                              {isPositive ? '+' : ''}₹{Math.abs(gainLoss).toLocaleString('en-IN')} ({gainLossPercent}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {activeTab === "sentiment" && (
        <div className="tab-content">
          <Card>
            <SectionTitle>🤖 AI Market Sentiment Analysis</SectionTitle>
            <p className="tab-description">
              Analyze market sentiment for your portfolio stocks using AI insights
            </p>
          </Card>
          <SentimentAnalysis portfolio={portfolio} />
        </div>
      )}

      {activeTab === "add" && (
        <div className="tab-content">
          <Card>
            <SectionTitle>➕ Add Stock to Portfolio</SectionTitle>
            <p className="tab-description">
              Add new stocks to track and manage your investment portfolio
            </p>
            <PortfolioInput portfolio={portfolio} setPortfolio={setPortfolio} />
          </Card>

          <Card>
            <SectionTitle>💡 Portfolio Tips</SectionTitle>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-emoji">🎯</span>
                <h4>Diversify</h4>
                <p>Don't put all eggs in one basket. Add stocks from different sectors.</p>
              </div>
              <div className="tip-card">
                <span className="tip-emoji">📊</span>
                <h4>Research</h4>
                <p>Check fundamentals and market news before adding stocks to your portfolio.</p>
              </div>
              <div className="tip-card">
                <span className="tip-emoji">⏰</span>
                <h4>Long-term</h4>
                <p>Invest with a long-term perspective and avoid panic selling.</p>
              </div>
              <div className="tip-card">
                <span className="tip-emoji">💰</span>
                <h4>Budget</h4>
                <p>Only invest money you can afford to lose. Manage risk wisely.</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default StockUpdates;

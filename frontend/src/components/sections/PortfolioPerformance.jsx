import { useState, useEffect } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import Input from "../ui/Input";
import Button from "../ui/Button";
import "./PortfolioPerformance.css";

function PortfolioPerformance() {
  const [portfolioData, setPortfolioData] = useState(() => {
    const saved = localStorage.getItem("portfolioPerformance");
    return saved ? JSON.parse(saved) : {
      holdings: {},
      totalInvested: 0,
      totalCurrent: 0,
    };
  });

  const [currentPrices, setCurrentPrices] = useState({});
  const [newStock, setNewStock] = useState({ symbol: "", quantity: 0, buyPrice: 0, currentPrice: 0 });

  const savePortfolio = (data) => {
    setPortfolioData(data);
    localStorage.setItem("portfolioPerformance", JSON.stringify(data));
  };

  const addHolding = () => {
    if (!newStock.symbol || !newStock.quantity || !newStock.buyPrice || !newStock.currentPrice) {
      alert("Please fill all fields");
      return;
    }

    const updatedHoldings = { ...portfolioData.holdings };
    updatedHoldings[newStock.symbol.toUpperCase()] = {
      quantity: newStock.quantity,
      buyPrice: newStock.buyPrice,
      currentPrice: newStock.currentPrice,
      costBasis: newStock.quantity * newStock.buyPrice,
      currentValue: newStock.quantity * newStock.currentPrice,
    };

    const totalInvested = Object.values(updatedHoldings).reduce((sum, h) => sum + h.costBasis, 0);
    const totalCurrent = Object.values(updatedHoldings).reduce((sum, h) => sum + h.currentValue, 0);

    savePortfolio({
      holdings: updatedHoldings,
      totalInvested,
      totalCurrent,
    });

    setNewStock({ symbol: "", quantity: 0, buyPrice: 0, currentPrice: 0 });
  };

  const updatePrice = (symbol, price) => {
    const holdings = portfolioData.holdings[symbol];
    if (holdings) {
      const newCurrentValue = holdings.quantity * price;
      const updatedHoldings = {
        ...portfolioData.holdings,
        [symbol]: { ...holdings, currentPrice: price, currentValue: newCurrentValue }
      };

      const totalCurrent = Object.values(updatedHoldings).reduce((sum, h) => sum + h.currentValue, 0);
      savePortfolio({
        ...portfolioData,
        holdings: updatedHoldings,
        totalCurrent,
      });
    }
  };

  const removeHolding = (symbol) => {
    const updatedHoldings = { ...portfolioData.holdings };
    delete updatedHoldings[symbol];

    const totalInvested = Object.values(updatedHoldings).reduce((sum, h) => sum + h.costBasis, 0);
    const totalCurrent = Object.values(updatedHoldings).reduce((sum, h) => sum + h.currentValue, 0);

    savePortfolio({
      holdings: updatedHoldings,
      totalInvested,
      totalCurrent,
    });
  };

  const totalGainLoss = portfolioData.totalCurrent - portfolioData.totalInvested;
  const totalGainLossPercent = portfolioData.totalInvested > 0 
    ? ((totalGainLoss / portfolioData.totalInvested) * 100).toFixed(2)
    : 0;

  const holdings = Object.entries(portfolioData.holdings || {});

  return (
    <div className="portfolio-section">
      <Card>
        <SectionTitle>📊 Portfolio Performance</SectionTitle>

        <div className="performance-summary">
          <div className="summary-card">
            <span className="summary-label">Total Invested</span>
            <span className="summary-value">₹{portfolioData.totalInvested.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Current Value</span>
            <span className="summary-value">₹{portfolioData.totalCurrent.toLocaleString('en-IN')}</span>
          </div>
          <div className={`summary-card ${totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
            <span className="summary-label">Total Gain/Loss</span>
            <span className="summary-value">
              {totalGainLoss >= 0 ? '📈' : '📉'} ₹{Math.abs(totalGainLoss).toLocaleString('en-IN')}
            </span>
            <span className="summary-percent">({totalGainLossPercent}%)</span>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>➕ Add Holding</SectionTitle>
        <div className="add-holding-form">
          <Input
            type="text"
            placeholder="Stock Symbol"
            value={newStock.symbol}
            onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={newStock.quantity}
            onChange={(e) => setNewStock({ ...newStock, quantity: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Buy Price"
            value={newStock.buyPrice}
            onChange={(e) => setNewStock({ ...newStock, buyPrice: parseFloat(e.target.value) })}
            step="0.01"
          />
          <Input
            type="number"
            placeholder="Current Price"
            value={newStock.currentPrice}
            onChange={(e) => setNewStock({ ...newStock, currentPrice: parseFloat(e.target.value) })}
            step="0.01"
          />
          <Button onClick={addHolding}>Add Holding</Button>
        </div>
      </Card>

      {holdings.length > 0 && (
        <Card>
          <SectionTitle>💼 Your Holdings</SectionTitle>
          <div className="holdings-grid">
            {holdings.map(([symbol, data]) => {
              const gainLoss = data.currentValue - data.costBasis;
              const gainLossPercent = ((gainLoss / data.costBasis) * 100).toFixed(2);
              const isPositive = gainLoss >= 0;

              return (
                <div key={symbol} className={`holding-card ${isPositive ? 'positive' : 'negative'}`}>
                  <div className="holding-header">
                    <h3>{symbol}</h3>
                    <button
                      onClick={() => removeHolding(symbol)}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="holding-details">
                    <div className="detail-row">
                      <span className="detail-label">Quantity:</span>
                      <span className="detail-value">{data.quantity}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Avg Cost:</span>
                      <span className="detail-value">₹{data.buyPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Current Price:</span>
                      <div className="price-input">
                        <Input
                          type="number"
                          value={data.currentPrice}
                          onChange={(e) => updatePrice(symbol, parseFloat(e.target.value))}
                          step="0.01"
                          style={{ marginBottom: 0 }}
                        />
                      </div>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Cost Basis:</span>
                      <span className="detail-value">₹{data.costBasis.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Current Value:</span>
                      <span className="detail-value highlight">₹{data.currentValue.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className={`gain-loss ${isPositive ? 'positive' : 'negative'}`}>
                    <div>
                      <span className="icon">{isPositive ? '📈' : '📉'}</span>
                      <span className="value">₹{Math.abs(gainLoss).toLocaleString('en-IN')}</span>
                    </div>
                    <span className="percent">({gainLossPercent}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

export default PortfolioPerformance;

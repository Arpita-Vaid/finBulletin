import { useState } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import Input from "../ui/Input";
import Button from "../ui/Button";
import "./Watchlist.css";

function Watchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [newStock, setNewStock] = useState({ symbol: "", targetPrice: 0 });
  const [stockPrices, setStockPrices] = useState({});

  const saveWatchlist = (list) => {
    setWatchlist(list);
    localStorage.setItem("watchlist", JSON.stringify(list));
  };

  const addToWatchlist = () => {
    if (!newStock.symbol) {
      alert("Please enter a stock symbol");
      return;
    }

    const stock = {
      id: Date.now(),
      symbol: newStock.symbol.toUpperCase(),
      targetPrice: newStock.targetPrice || 0,
      currentPrice: 0,
      dateAdded: new Date().toLocaleDateString(),
      alertTriggered: false,
    };

    saveWatchlist([...watchlist, stock]);
    setNewStock({ symbol: "", targetPrice: 0 });
  };

  const updatePrice = (id, price) => {
    const updated = watchlist.map(stock => {
      if (stock.id === id) {
        const priceChanged = stock.currentPrice !== price;
        return {
          ...stock,
          currentPrice: price,
          alertTriggered: stock.targetPrice > 0 && price >= stock.targetPrice ? true : stock.alertTriggered,
        };
      }
      return stock;
    });
    saveWatchlist(updated);
  };

  const removeFromWatchlist = (id) => {
    saveWatchlist(watchlist.filter(stock => stock.id !== id));
  };

  const resetAlert = (id) => {
    const updated = watchlist.map(stock =>
      stock.id === id ? { ...stock, alertTriggered: false } : stock
    );
    saveWatchlist(updated);
  };

  return (
    <div className="watchlist-container">
      <Card>
        <SectionTitle>⭐ Stock Watchlist</SectionTitle>

        <div className="add-to-watchlist">
          <Input
            type="text"
            placeholder="Stock Symbol (e.g., TCS)"
            value={newStock.symbol}
            onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Target Price (optional)"
            value={newStock.targetPrice}
            onChange={(e) => setNewStock({ ...newStock, targetPrice: parseFloat(e.target.value) })}
            step="0.01"
          />
          <Button onClick={addToWatchlist}>➕ Add to Watchlist</Button>
        </div>
      </Card>

      {watchlist.length === 0 ? (
        <Card>
          <p className="empty-message">No stocks in your watchlist yet. Add some to track!</p>
        </Card>
      ) : (
        <Card>
          <SectionTitle>📊 Your Watchlist ({watchlist.length})</SectionTitle>
          <div className="watchlist-grid">
            {watchlist.map(stock => {
              const priceChange = stock.currentPrice - stock.targetPrice;
              const isAboveTarget = stock.targetPrice > 0 && stock.currentPrice >= stock.targetPrice;

              return (
                <div
                  key={stock.id}
                  className={`watchlist-card ${isAboveTarget ? 'alert-active' : ''}`}
                >
                  {stock.alertTriggered && (
                    <div className="alert-badge">🔔 Alert!</div>
                  )}

                  <div className="stock-header">
                    <h3>{stock.symbol}</h3>
                    <button
                      onClick={() => removeFromWatchlist(stock.id)}
                      className="remove-watch"
                      title="Remove from watchlist"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="stock-info">
                    <div className="info-row">
                      <span className="label">Current Price:</span>
                      <div className="price-edit">
                        <Input
                          type="number"
                          value={stock.currentPrice}
                          onChange={(e) => updatePrice(stock.id, parseFloat(e.target.value))}
                          step="0.01"
                          placeholder="₹0"
                        />
                      </div>
                    </div>

                    {stock.targetPrice > 0 && (
                      <div className="info-row">
                        <span className="label">Target Price:</span>
                        <span className="value">₹{stock.targetPrice.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    {stock.currentPrice > 0 && stock.targetPrice > 0 && (
                      <div className={`price-diff ${isAboveTarget ? 'positive' : 'negative'}`}>
                        <span className="icon">{isAboveTarget ? '✅' : '⏳'}</span>
                        <div>
                          <span className="label">
                            {isAboveTarget ? 'Target Reached!' : 'Difference:'}
                          </span>
                          <span className="diff-value">
                            {isAboveTarget ? '✓' : ''} ₹{Math.abs(priceChange).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="date-added">Added: {stock.dateAdded}</div>
                  </div>

                  {stock.alertTriggered && (
                    <Button
                      onClick={() => resetAlert(stock.id)}
                      className="reset-alert-btn"
                    >
                      Reset Alert
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

export default Watchlist;

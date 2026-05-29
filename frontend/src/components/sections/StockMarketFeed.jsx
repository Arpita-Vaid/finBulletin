import { useState, useEffect } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import "./StockMarketFeed.css";

function StockMarketFeed() {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [updatingStocks, setUpdatingStocks] = useState(new Set());
  const [stockChartData, setStockChartData] = useState({});

  // Generate historical data for a stock
  const generateChartData = (initialPrice) => {
    const data = [];
    let currentPrice = initialPrice;
    for (let i = 0; i < 30; i++) {
      const priceChange = (Math.random() - 0.5) * 15;
      currentPrice = Math.max(currentPrice + priceChange, initialPrice * 0.9);
      data.push({
        time: `${i === 0 ? "Now" : i + "m ago"}`,
        price: parseFloat(currentPrice.toFixed(2)),
        index: i,
      });
    }
    return data.reverse();
  };

  // Mock real-time stock data
  const mockStocks = [
    { id: 1, symbol: "RELIANCE", name: "Reliance Industries", price: 2850.50, change: 45.30, changePercent: 1.62, high: 2910.00, low: 2805.25, volume: 2500000 },
    { id: 2, symbol: "TCS", name: "Tata Consultancy Services", price: 3540.25, change: -22.75, changePercent: -0.64, high: 3620.00, low: 3520.50, volume: 1800000 },
    { id: 3, symbol: "INFY", name: "Infosys", price: 1445.80, change: 28.20, changePercent: 1.99, high: 1480.00, low: 1415.00, volume: 2100000 },
    { id: 4, symbol: "WIPRO", name: "Wipro", price: 425.50, change: 12.45, changePercent: 3.01, high: 435.00, low: 412.75, volume: 3500000 },
    { id: 5, symbol: "HDFCBANK", name: "HDFC Bank", price: 1698.75, change: -35.20, changePercent: -2.03, high: 1750.00, low: 1695.00, volume: 4200000 },
    { id: 6, symbol: "ICICIBANK", name: "ICICI Bank", price: 945.30, change: 22.10, changePercent: 2.39, high: 965.00, low: 920.00, volume: 3100000 },
    { id: 7, symbol: "BAJAJFINSV", name: "Bajaj Finserv", price: 1580.45, change: -15.55, changePercent: -0.97, high: 1610.00, low: 1565.00, volume: 1200000 },
    { id: 8, symbol: "ITC", name: "ITC Limited", price: 445.20, change: 8.75, changePercent: 1.99, high: 460.00, low: 435.00, volume: 2800000 },
    { id: 9, symbol: "SBIN", name: "State Bank of India", price: 585.50, change: 15.30, changePercent: 2.68, high: 595.00, low: 568.00, volume: 5100000 },
    { id: 10, symbol: "MARUTI", name: "Maruti Suzuki", price: 9245.80, change: -125.45, changePercent: -1.34, high: 9410.00, low: 9210.00, volume: 850000 },
    { id: 11, symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1125.40, change: 35.20, changePercent: 3.23, high: 1150.00, low: 1095.00, volume: 2600000 },
    { id: 12, symbol: "ADANIPORTS", name: "Adani Ports & SEZ", price: 875.25, change: -18.75, changePercent: -2.10, high: 905.00, low: 868.00, volume: 1950000 },
  ];

  useEffect(() => {
    // Initialize chart data for all stocks
    const initialChartData = {};
    mockStocks.forEach(stock => {
      initialChartData[stock.id] = generateChartData(stock.price);
    });
    setStockChartData(initialChartData);

    setStocks(mockStocks);
    setFilteredStocks(mockStocks);

    const interval = setInterval(() => {
      setStocks(prevStocks =>
        prevStocks.map(stock => {
          const priceChange = (Math.random() - 0.5) * 20;
          const newPrice = Math.max(stock.price + priceChange, 10);
          const changePercent = ((priceChange / stock.price) * 100).toFixed(2);

          setUpdatingStocks(prev => new Set([...prev, stock.id]));
          setTimeout(() => {
            setUpdatingStocks(prev => {
              const newSet = new Set(prev);
              newSet.delete(stock.id);
              return newSet;
            });
          }, 600);

          // Update chart data with new price
          setStockChartData(prevData => ({
            ...prevData,
            [stock.id]: [
              ...prevData[stock.id].slice(1),
              {
                time: "Now",
                price: parseFloat(newPrice.toFixed(2)),
                index: 29,
              }
            ]
          }));

          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(priceChange.toFixed(2)),
            changePercent: parseFloat(changePercent),
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStocks(stocks);
    } else {
      const filtered = stocks.filter(stock =>
        stock.symbol.toUpperCase().includes(searchTerm.toUpperCase()) ||
        stock.name.toUpperCase().includes(searchTerm.toUpperCase())
      );
      setFilteredStocks(filtered);
    }
  }, [searchTerm, stocks]);

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
  };

  const closeModal = () => {
    setSelectedStock(null);
  };

  return (
    <div className="stock-market-feed">
      <Card>
        <div className="feed-header">
          <div>
            <SectionTitle>📈 Live Market Feed</SectionTitle>
            <p className="feed-subtitle">Real-time stock prices • Growing & Declining updates</p>
          </div>
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">LIVE</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search by company name or symbol (e.g., RELIANCE, TCS)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="stock-search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        {filteredStocks.length === 0 ? (
          <div className="no-results">
            <p>📊 No stocks found matching "{searchTerm}"</p>
            <p>Try searching for: RELIANCE, TCS, INFY, WIPRO, HDFCBANK</p>
          </div>
        ) : (
          <div className="stocks-list">
            {filteredStocks.map((stock) => (
              <div
                key={stock.id}
                className={`stock-item ${stock.change >= 0 ? "positive" : "negative"} ${updatingStocks.has(stock.id) ? "updating" : ""}`}
                onClick={() => handleStockClick(stock)}
              >
                <div className="stock-left">
                  <div className="stock-header">
                    <h3 className="stock-symbol">{stock.symbol}</h3>
                    <span className={`price-change-badge ${stock.change >= 0 ? "gain" : "loss"}`}>
                      {stock.change >= 0 ? "📈" : "📉"} {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}
                    </span>
                  </div>
                  <p className="stock-name">{stock.name}</p>
                </div>

                <div className="stock-right">
                  <div className="price-section">
                    <p className={`stock-price ${updatingStocks.has(stock.id) ? "price-updating" : ""}`}>
                      ₹{parseFloat(stock.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <span className={`percent-change ${stock.change >= 0 ? "positive-text" : "negative-text"}`}>
                      {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <p className="volume-info">Vol: {(stock.volume / 1000000).toFixed(1)}M</p>
                </div>

                <div className="stock-indicator">
                  <div className={`indicator-bar ${stock.change >= 0 ? "positive-bar" : "negative-bar"} ${updatingStocks.has(stock.id) ? "bar-updating" : ""}`}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {selectedStock && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>

            <div className="modal-header">
              <div>
                <h2>{selectedStock.symbol}</h2>
                <p className="modal-company">{selectedStock.name}</p>
              </div>
              <div className={`modal-status ${selectedStock.change >= 0 ? "positive" : "negative"}`}>
                {selectedStock.change >= 0 ? "📈" : "📉"}
              </div>
            </div>

            <div className="modal-price">
              <div className="price-display">
                <p className="current-price">₹{parseFloat(selectedStock.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <span className={`price-change ${selectedStock.change >= 0 ? "positive-text" : "negative-text"}`}>
                  {selectedStock.change >= 0 ? "+" : ""}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Price Chart */}
            <div className="chart-container">
              <h3 className="chart-title">📊 30-Minute Price Chart</h3>
              <div className="chart-wrapper">
                <svg viewBox="0 0 100 60" className="price-chart" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="15" x2="100" y2="15" className="grid-line" />
                  <line x1="0" y1="30" x2="100" y2="30" className="grid-line" />
                  <line x1="0" y1="45" x2="100" y2="45" className="grid-line" />
                  
                  {/* Price line chart */}
                  {stockChartData[selectedStock.id] && (
                    <>
                      {/* Background gradient area */}
                      <defs>
                        <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={selectedStock.change >= 0 ? "rgba(0, 208, 132, 0.3)" : "rgba(255, 96, 87, 0.3)"} />
                          <stop offset="100%" stopColor={selectedStock.change >= 0 ? "rgba(0, 208, 132, 0.05)" : "rgba(255, 96, 87, 0.05)"} />
                        </linearGradient>
                      </defs>
                      
                      {/* Polyline for price movement */}
                      <polyline
                        points={stockChartData[selectedStock.id].map((d, i) => {
                          const minPrice = Math.min(...stockChartData[selectedStock.id].map(p => p.price));
                          const maxPrice = Math.max(...stockChartData[selectedStock.id].map(p => p.price));
                          const range = maxPrice - minPrice || 1;
                          const y = 50 - ((d.price - minPrice) / range) * 50;
                          return `${(i / (stockChartData[selectedStock.id].length - 1)) * 100},${y}`;
                        }).join(" ")}
                        className={`price-line ${selectedStock.change >= 0 ? "positive-line" : "negative-line"}`}
                      />
                      
                      {/* Filled area under the line */}
                      <polygon
                        points={`0,60 ${stockChartData[selectedStock.id].map((d, i) => {
                          const minPrice = Math.min(...stockChartData[selectedStock.id].map(p => p.price));
                          const maxPrice = Math.max(...stockChartData[selectedStock.id].map(p => p.price));
                          const range = maxPrice - minPrice || 1;
                          const y = 50 - ((d.price - minPrice) / range) * 50;
                          return `${(i / (stockChartData[selectedStock.id].length - 1)) * 100},${y}`;
                        }).join(" ")} 100,60`}
                        className="price-area"
                      />
                    </>
                  )}
                </svg>
              </div>
              
              {/* Chart stats */}
              {stockChartData[selectedStock.id] && (
                <div className="chart-stats">
                  <div className="chart-stat">
                    <span className="chart-stat-label">High</span>
                    <span className="chart-stat-value">
                      ₹{Math.max(...stockChartData[selectedStock.id].map(d => d.price)).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="chart-stat">
                    <span className="chart-stat-label">Low</span>
                    <span className="chart-stat-value">
                      ₹{Math.min(...stockChartData[selectedStock.id].map(d => d.price)).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="chart-stat">
                    <span className="chart-stat-label">Avg</span>
                    <span className="chart-stat-value">
                      ₹{(stockChartData[selectedStock.id].reduce((sum, d) => sum + d.price, 0) / stockChartData[selectedStock.id].length).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-stats">
              <div className="stat-box">
                <span className="stat-label">Day High</span>
                <span className="stat-value">₹{selectedStock.high.toLocaleString("en-IN")}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Day Low</span>
                <span className="stat-value">₹{selectedStock.low.toLocaleString("en-IN")}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Volume</span>
                <span className="stat-value">{(selectedStock.volume / 1000000).toFixed(2)}M</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Change %</span>
                <span className={`stat-value ${selectedStock.change >= 0 ? "positive-text" : "negative-text"}`}>
                  {selectedStock.change >= 0 ? "+" : ""}{selectedStock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="action-btn buy-btn">🛒 BUY</button>
              <button className="action-btn sell-btn">💰 SELL</button>
              <button className="action-btn watchlist-btn">⭐ ADD TO WATCHLIST</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockMarketFeed;

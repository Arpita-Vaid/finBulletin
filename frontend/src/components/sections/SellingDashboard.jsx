import { useState } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ProfitLossCalculator from "./ProfitLossCalculator";
import TaxCalculator from "./TaxCalculator";
import TransactionHistory from "./TransactionHistory";
import "./SellingDashboard.css";

function SellingDashboard({ portfolio }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [sellingStocks, setSellingStocks] = useState(() => {
    const saved = localStorage.getItem("sellingOrders");
    return saved ? JSON.parse(saved) : [];
  });

  const [stockSymbol, setStockSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const saveSellingOrders = (orders) => {
    setSellingStocks(orders);
    localStorage.setItem("sellingOrders", JSON.stringify(orders));
  };

  const handleAddSelling = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!stockSymbol.trim() || !quantity || !price) {
      setError("Please fill in all fields");
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      setError("Quantity must be a positive number");
      return;
    }

    if (isNaN(price) || price <= 0) {
      setError("Price must be a positive number");
      return;
    }

    const newSelling = {
      id: Date.now(),
      symbol: stockSymbol.toUpperCase(),
      quantity: parseInt(quantity),
      price: parseFloat(price),
      totalValue: parseInt(quantity) * parseFloat(price),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    saveSellingOrders([...sellingStocks, newSelling]);
    setSuccess(`${stockSymbol.toUpperCase()} added to selling list!`);
    setStockSymbol("");
    setQuantity("");
    setPrice("");

    setTimeout(() => setSuccess(""), 3000);
  };

  const removeSelling = (id) => {
    saveSellingOrders(sellingStocks.filter(item => item.id !== id));
  };

  const totalSalesValue = sellingStocks.reduce((sum, item) => sum + item.totalValue, 0);

  return (
    <div className="selling-dashboard">
      <Card>
        <SectionTitle>💵 Sell Stocks Dashboard</SectionTitle>
        <p className="dashboard-subtitle">
          Manage your stock sales, calculate taxes, and track proceeds
        </p>
      </Card>

      <div className="section-tabs">
        <button
          className={`section-tab ${activeSection === "overview" ? "active" : ""}`}
          onClick={() => setActiveSection("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`section-tab ${activeSection === "plcalc" ? "active" : ""}`}
          onClick={() => setActiveSection("plcalc")}
        >
          🧮 P/L Calc
        </button>
        <button
          className={`section-tab ${activeSection === "tax" ? "active" : ""}`}
          onClick={() => setActiveSection("tax")}
        >
          🧾 Tax
        </button>
        <button
          className={`section-tab ${activeSection === "history" ? "active" : ""}`}
          onClick={() => setActiveSection("history")}
        >
          📋 History
        </button>
      </div>

      {activeSection === "overview" && (
        <>
          <Card>
            <SectionTitle>📋 Add Stock to Sell</SectionTitle>
            <form onSubmit={handleAddSelling} className="selling-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Stock Symbol</label>
                  <Input
                    type="text"
                    placeholder="e.g., TCS, INFY, RELIANCE"
                    value={stockSymbol}
                    onChange={(e) => setStockSymbol(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <Input
                    type="number"
                    placeholder="Number of shares"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Price per Share (₹)</label>
                  <Input
                    type="number"
                    placeholder="Selling price"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <Button type="submit" className="add-button">
                ➕ Add to Selling List
              </Button>
            </form>
          </Card>

          <Card>
            <SectionTitle>📊 Your Selling Orders</SectionTitle>
            {sellingStocks.length === 0 ? (
              <div className="empty-state">
                <p>No stocks added for selling yet.</p>
                <p className="empty-hint">Add your first stock above to get started.</p>
              </div>
            ) : (
              <>
                <div className="selling-stats">
                  <div className="stat-card">
                    <span className="stat-label">Total Orders</span>
                    <span className="stat-value">{sellingStocks.length}</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Total Value</span>
                    <span className="stat-value">₹{totalSalesValue.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="selling-list">
                  {sellingStocks.map((item) => (
                    <div key={item.id} className="selling-item">
                      <div className="selling-header">
                        <div className="selling-info">
                          <h3>{item.symbol}</h3>
                          <p className="selling-date">
                            {item.date} at {item.time}
                          </p>
                        </div>
                        <button
                          onClick={() => removeSelling(item.id)}
                          className="delete-button"
                          title="Remove from list"
                        >
                          ❌
                        </button>
                      </div>

                      <div className="selling-details">
                        <div className="detail">
                          <span className="label">Quantity:</span>
                          <span className="value">{item.quantity} shares</span>
                        </div>
                        <div className="detail">
                          <span className="label">Price/Share:</span>
                          <span className="value">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="detail">
                          <span className="label">Total Value:</span>
                          <span className="value highlight">₹{item.totalValue.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          <Card>
            <SectionTitle>💡 Selling Tips</SectionTitle>
            <div className="tips-container">
              <div className="tip">
                <span className="tip-icon">📈</span>
                <p><strong>Check Market Trends:</strong> Review the market sentiment before finalizing sales</p>
              </div>
              <div className="tip">
                <span className="tip-icon">📊</span>
                <p><strong>Monitor News:</strong> Keep track of relevant news for your stocks</p>
              </div>
              <div className="tip">
                <span className="tip-icon">💰</span>
                <p><strong>Price Strategy:</strong> Set competitive prices based on current market rates</p>
              </div>
              <div className="tip">
                <span className="tip-icon">⏰</span>
                <p><strong>Timing Matters:</strong> Sell at the right time to maximize returns</p>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeSection === "plcalc" && (
        <ProfitLossCalculator />
      )}

      {activeSection === "tax" && (
        <TaxCalculator />
      )}

      {activeSection === "history" && (
        <TransactionHistory />
      )}
    </div>
  );
}

export default SellingDashboard;

import { useState } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import "./TransactionHistory.css";

function TransactionHistory() {
  const [filterSymbol, setFilterSymbol] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Combine all transactions from different sources
  const [allTransactions, setAllTransactions] = useState(() => {
    const buyOrders = JSON.parse(localStorage.getItem("buyOrders") || "[]");
    const sellOrders = JSON.parse(localStorage.getItem("sellingOrders") || "[]");

    const combined = [
      ...buyOrders.map(order => ({ ...order, type: "BUY", date: order.date })),
      ...sellOrders.map(order => ({ ...order, type: "SELL", date: order.date })),
    ];

    return combined.sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  const filteredTransactions = allTransactions.filter(trans =>
    trans.symbol.includes(filterSymbol.toUpperCase())
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case "symbol":
        return a.symbol.localeCompare(b.symbol);
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const totalBuyValue = allTransactions
    .filter(t => t.type === "BUY")
    .reduce((sum, t) => sum + (t.totalCost || 0), 0);

  const totalSellValue = allTransactions
    .filter(t => t.type === "SELL")
    .reduce((sum, t) => sum + (t.totalValue || 0), 0);

  const netValue = totalSellValue - totalBuyValue;

  return (
    <Card>
      <SectionTitle>📊 Transaction History</SectionTitle>

      <div className="history-summary">
        <div className="summary-item">
          <span className="label">Total Buy Value</span>
          <span className="value">₹{totalBuyValue.toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-item">
          <span className="label">Total Sell Value</span>
          <span className="value">₹{totalSellValue.toLocaleString('en-IN')}</span>
        </div>
        <div className={`summary-item ${netValue >= 0 ? 'positive' : 'negative'}`}>
          <span className="label">Net Value</span>
          <span className="value">₹{Math.abs(netValue).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by symbol..."
          value={filterSymbol}
          onChange={(e) => setFilterSymbol(e.target.value)}
          className="filter-input"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="date">Sort by Date</option>
          <option value="symbol">Sort by Symbol</option>
          <option value="type">Sort by Type</option>
        </select>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="empty-history">
          <p>No transactions yet.</p>
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Value</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((trans, idx) => (
                <tr key={idx} className={`row-${trans.type}`}>
                  <td className="type-badge">
                    <span className={`badge ${trans.type}`}>
                      {trans.type === "BUY" ? "🛒" : "💵"} {trans.type}
                    </span>
                  </td>
                  <td className="symbol">{trans.symbol}</td>
                  <td>{trans.quantity || trans.quantity}</td>
                  <td>₹{(trans.buyPrice || trans.price || 0).toLocaleString('en-IN')}</td>
                  <td className={trans.type === "BUY" ? "buy-value" : "sell-value"}>
                    ₹{(trans.totalCost || trans.totalValue || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="date">{trans.date || trans.timestamp?.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default TransactionHistory;

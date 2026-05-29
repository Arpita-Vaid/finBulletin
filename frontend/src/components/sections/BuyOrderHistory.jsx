import { useState } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import "./BuyOrderHistory.css";

function BuyOrderHistory() {
  const [buyOrders, setBuyOrders] = useState(() => {
    const saved = localStorage.getItem("buyOrders");
    return saved ? JSON.parse(saved) : [];
  });

  const saveBuyOrders = (orders) => {
    setBuyOrders(orders);
    localStorage.setItem("buyOrders", JSON.stringify(orders));
  };

  const addBuyOrder = (stock) => {
    const newOrder = {
      id: Date.now(),
      symbol: stock.symbol.toUpperCase(),
      quantity: stock.quantity,
      buyPrice: stock.price,
      totalCost: stock.quantity * stock.price,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      timestamp: new Date(),
    };
    saveBuyOrders([...buyOrders, newOrder]);
    return true;
  };

  const removeBuyOrder = (id) => {
    saveBuyOrders(buyOrders.filter(order => order.id !== id));
  };

  const totalInvested = buyOrders.reduce((sum, order) => sum + order.totalCost, 0);
  const totalShares = buyOrders.reduce((sum, order) => sum + order.quantity, 0);
  const averageCost = totalShares > 0 ? (totalInvested / totalShares).toFixed(2) : 0;

  return (
    <Card>
      <SectionTitle>📜 Buy Order History</SectionTitle>

      {buyOrders.length === 0 ? (
        <div className="empty-state">
          <p>No buy orders yet. Start building your portfolio!</p>
        </div>
      ) : (
        <>
          <div className="order-stats">
            <div className="stat-box">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{buyOrders.length}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Total Invested</span>
              <span className="stat-value">₹{totalInvested.toLocaleString('en-IN')}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Total Shares</span>
              <span className="stat-value">{totalShares}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Avg Cost/Share</span>
              <span className="stat-value">₹{averageCost}</span>
            </div>
          </div>

          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Quantity</th>
                  <th>Buy Price</th>
                  <th>Total Cost</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {buyOrders.map(order => (
                  <tr key={order.id}>
                    <td className="symbol">{order.symbol}</td>
                    <td>{order.quantity}</td>
                    <td>₹{order.buyPrice.toLocaleString('en-IN')}</td>
                    <td className="total">₹{order.totalCost.toLocaleString('en-IN')}</td>
                    <td className="date">{order.date}</td>
                    <td>
                      <button
                        onClick={() => removeBuyOrder(order.id)}
                        className="delete-btn"
                        title="Remove order"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}

export default BuyOrderHistory;

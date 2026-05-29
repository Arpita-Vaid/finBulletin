import { useState } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import Input from "../ui/Input";
import Button from "../ui/Button";
import "./ProfitLossCalculator.css";

function ProfitLossCalculator() {
  const [calculations, setCalculations] = useState(() => {
    const saved = localStorage.getItem("plCalculations");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    symbol: "",
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    brokeragePercent: 0,
  });

  const [errors, setErrors] = useState("");

  const saveCalculations = (calcs) => {
    setCalculations(calcs);
    localStorage.setItem("plCalculations", JSON.stringify(calcs));
  };

  const handleCalculate = () => {
    setErrors("");

    if (!form.symbol || !form.quantity || !form.buyPrice || !form.sellPrice) {
      setErrors("Please fill all required fields");
      return;
    }

    if (form.quantity <= 0 || form.buyPrice <= 0 || form.sellPrice <= 0) {
      setErrors("Values must be positive numbers");
      return;
    }

    const totalBuyCost = form.quantity * form.buyPrice;
    const totalSellValue = form.quantity * form.sellPrice;
    const brokerageCost = (totalBuyCost + totalSellValue) * (form.brokeragePercent / 100);
    const netProfit = totalSellValue - totalBuyCost - brokerageCost;
    const profitPercent = ((netProfit / totalBuyCost) * 100).toFixed(2);

    const calculation = {
      id: Date.now(),
      symbol: form.symbol.toUpperCase(),
      quantity: form.quantity,
      buyPrice: form.buyPrice,
      sellPrice: form.sellPrice,
      totalBuyCost,
      totalSellValue,
      brokeragePercent: form.brokeragePercent,
      brokerageCost,
      netProfit,
      profitPercent,
      date: new Date().toLocaleDateString(),
    };

    saveCalculations([calculation, ...calculations]);
    setForm({ symbol: "", quantity: 0, buyPrice: 0, sellPrice: 0, brokeragePercent: 0 });
  };

  const removeCalculation = (id) => {
    saveCalculations(calculations.filter(calc => calc.id !== id));
  };

  return (
    <div className="pl-calculator">
      <Card>
        <SectionTitle>🧮 Profit/Loss Calculator</SectionTitle>

        <div className="calculator-form">
          <div className="form-grid">
            <div>
              <label>Stock Symbol *</label>
              <Input
                type="text"
                placeholder="e.g., TCS"
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              />
            </div>
            <div>
              <label>Quantity *</label>
              <Input
                type="number"
                placeholder="Number of shares"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label>Buy Price (₹) *</label>
              <Input
                type="number"
                placeholder="Purchase price"
                step="0.01"
                value={form.buyPrice}
                onChange={(e) => setForm({ ...form, buyPrice: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label>Sell Price (₹) *</label>
              <Input
                type="number"
                placeholder="Selling price"
                step="0.01"
                value={form.sellPrice}
                onChange={(e) => setForm({ ...form, sellPrice: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label>Brokerage % (optional)</label>
              <Input
                type="number"
                placeholder="e.g., 0.1"
                step="0.01"
                value={form.brokeragePercent}
                onChange={(e) => setForm({ ...form, brokeragePercent: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          {errors && <div className="error-msg">{errors}</div>}

          <Button onClick={handleCalculate} className="calc-btn">
            📊 Calculate P/L
          </Button>
        </div>
      </Card>

      {calculations.length > 0 && (
        <Card>
          <SectionTitle>📈 Calculation History</SectionTitle>
          <div className="calculations-grid">
            {calculations.map(calc => (
              <div
                key={calc.id}
                className={`calc-card ${calc.netProfit >= 0 ? 'profit' : 'loss'}`}
              >
                <div className="calc-header">
                  <h3>{calc.symbol}</h3>
                  <button
                    onClick={() => removeCalculation(calc.id)}
                    className="close-btn"
                  >
                    ✕
                  </button>
                </div>

                <div className="calc-details">
                  <div className="row">
                    <span className="label">Quantity:</span>
                    <span className="value">{calc.quantity} shares</span>
                  </div>
                  <div className="row">
                    <span className="label">Buy Price:</span>
                    <span className="value">₹{calc.buyPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="row">
                    <span className="label">Sell Price:</span>
                    <span className="value">₹{calc.sellPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="row">
                    <span className="label">Total Cost:</span>
                    <span className="value">₹{calc.totalBuyCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="row">
                    <span className="label">Total Value:</span>
                    <span className="value">₹{calc.totalSellValue.toLocaleString('en-IN')}</span>
                  </div>
                  {calc.brokeragePercent > 0 && (
                    <div className="row">
                      <span className="label">Brokerage:</span>
                      <span className="value">₹{calc.brokerageCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                <div className={`pl-result ${calc.netProfit >= 0 ? 'profit' : 'loss'}`}>
                  <div className="pl-icon">
                    {calc.netProfit >= 0 ? '📈' : '📉'}
                  </div>
                  <div className="pl-content">
                    <span className="pl-label">Profit/Loss:</span>
                    <span className="pl-value">
                      ₹{Math.abs(calc.netProfit).toLocaleString('en-IN')}
                    </span>
                    <span className="pl-percent">
                      {calc.netProfit >= 0 ? '+' : ''}{calc.profitPercent}%
                    </span>
                  </div>
                </div>

                <div className="calc-date">{calc.date}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export default ProfitLossCalculator;

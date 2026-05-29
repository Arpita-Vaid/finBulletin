import { useState } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import Input from "../ui/Input";
import Button from "../ui/Button";
import "./TaxCalculator.css";

function TaxCalculator() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("taxTransactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    symbol: "",
    buyPrice: 0,
    sellPrice: 0,
    quantity: 0,
    buyDate: "",
    sellDate: "",
  });

  const [errors, setErrors] = useState("");

  const saveTransactions = (trans) => {
    setTransactions(trans);
    localStorage.setItem("taxTransactions", JSON.stringify(trans));
  };

  const calculateHoldingPeriod = (buyDate, sellDate) => {
    const buy = new Date(buyDate);
    const sell = new Date(sellDate);
    const days = (sell - buy) / (1000 * 60 * 60 * 24);
    return Math.floor(days);
  };

  const handleAddTransaction = () => {
    setErrors("");

    if (!form.symbol || !form.buyPrice || !form.sellPrice || !form.quantity || !form.buyDate || !form.sellDate) {
      setErrors("Please fill all fields");
      return;
    }

    const holdingDays = calculateHoldingPeriod(form.buyDate, form.sellDate);
    if (holdingDays < 0) {
      setErrors("Sell date must be after buy date");
      return;
    }

    const isLongTerm = holdingDays >= 365;
    const capital = (form.sellPrice - form.buyPrice) * form.quantity;
    const taxRate = isLongTerm ? 20 : 30; // LTCG: 20%, STCG: 30%
    const tax = (capital * taxRate) / 100;
    const netGain = capital - tax;

    const transaction = {
      id: Date.now(),
      symbol: form.symbol.toUpperCase(),
      buyPrice: form.buyPrice,
      sellPrice: form.sellPrice,
      quantity: form.quantity,
      buyDate: form.buyDate,
      sellDate: form.sellDate,
      holdingDays,
      isLongTerm,
      capital,
      taxRate,
      tax,
      netGain,
      dateAdded: new Date().toLocaleDateString(),
    };

    saveTransactions([transaction, ...transactions]);
    setForm({
      symbol: "",
      buyPrice: 0,
      sellPrice: 0,
      quantity: 0,
      buyDate: "",
      sellDate: "",
    });
  };

  const removeTransaction = (id) => {
    saveTransactions(transactions.filter(t => t.id !== id));
  };

  const totalCapitalGain = transactions.reduce((sum, t) => sum + t.capital, 0);
  const totalTax = transactions.reduce((sum, t) => sum + t.tax, 0);
  const totalNetGain = totalCapitalGain - totalTax;

  return (
    <div className="tax-calculator">
      <Card>
        <SectionTitle>🧾 Capital Gains Tax Calculator</SectionTitle>
        <p className="tax-info">Calculate long-term (20%) and short-term (30%) capital gains tax</p>

        <div className="tax-form">
          <div className="form-grid">
            <Input
              type="text"
              placeholder="Stock Symbol"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Buy Price"
              step="0.01"
              value={form.buyPrice}
              onChange={(e) => setForm({ ...form, buyPrice: parseFloat(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Sell Price"
              step="0.01"
              value={form.sellPrice}
              onChange={(e) => setForm({ ...form, sellPrice: parseFloat(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) })}
            />
            <Input
              type="date"
              value={form.buyDate}
              onChange={(e) => setForm({ ...form, buyDate: e.target.value })}
            />
            <Input
              type="date"
              value={form.sellDate}
              onChange={(e) => setForm({ ...form, sellDate: e.target.value })}
            />
          </div>

          {errors && <div className="error-msg">{errors}</div>}

          <Button onClick={handleAddTransaction} className="add-trans-btn">
            ➕ Calculate Tax
          </Button>
        </div>
      </Card>

      {transactions.length > 0 && (
        <>
          <Card>
            <SectionTitle>📊 Tax Summary</SectionTitle>
            <div className="tax-summary">
              <div className="summary-box">
                <span className="label">Total Capital Gain</span>
                <span className={`value ${totalCapitalGain >= 0 ? 'positive' : 'negative'}`}>
                  ₹{Math.abs(totalCapitalGain).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="summary-box">
                <span className="label">Total Tax Liability</span>
                <span className="value warning">₹{totalTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-box">
                <span className="label">Net Gain (After Tax)</span>
                <span className={`value ${totalNetGain >= 0 ? 'positive' : 'negative'}`}>
                  ₹{totalNetGain.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>📋 Tax Transactions</SectionTitle>
            <div className="transactions-list">
              {transactions.map(trans => (
                <div key={trans.id} className={`transaction-card ${trans.isLongTerm ? 'ltcg' : 'stcg'}`}>
                  <div className="trans-header">
                    <div>
                      <h3>{trans.symbol}</h3>
                      <span className={`tag ${trans.isLongTerm ? 'ltcg' : 'stcg'}`}>
                        {trans.isLongTerm ? 'LTCG (20%)' : 'STCG (30%)'}
                      </span>
                    </div>
                    <button onClick={() => removeTransaction(trans.id)} className="del-btn">✕</button>
                  </div>

                  <div className="trans-details">
                    <div className="detail">
                      <span>Buy Date:</span>
                      <span>{trans.buyDate}</span>
                    </div>
                    <div className="detail">
                      <span>Sell Date:</span>
                      <span>{trans.sellDate}</span>
                    </div>
                    <div className="detail">
                      <span>Holding Period:</span>
                      <span>{trans.holdingDays} days</span>
                    </div>
                    <div className="detail">
                      <span>Capital Gain/Loss:</span>
                      <span className={trans.capital >= 0 ? 'positive' : 'negative'}>
                        ₹{Math.abs(trans.capital).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="detail">
                      <span>Tax ({trans.taxRate}%):</span>
                      <span className="warning">₹{trans.tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="detail final">
                      <span>Net Gain:</span>
                      <span className={trans.netGain >= 0 ? 'positive' : 'negative'}>
                        ₹{trans.netGain.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default TaxCalculator;

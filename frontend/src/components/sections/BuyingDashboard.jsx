import { useState, useEffect } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import GeneralNews from "./GeneralNews";
import PortfolioInput from "./PortfolioInput";
import FilteredNews from "./FilteredNews";
import SentimentAnalysis from "./SentimentAnalysis";
import BuyOrderHistory from "./BuyOrderHistory";
import PortfolioPerformance from "./PortfolioPerformance";
import Watchlist from "./Watchlist";
import ProfitLossCalculator from "./ProfitLossCalculator";
import TransactionHistory from "./TransactionHistory";

function BuyingDashboard({ portfolio, setPortfolio, filteredNews, loadingNews, errorNews, generalNewsLoaded, onNewsLoaded }) {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="dashboard-content">
      <Card>
        <SectionTitle>💰 Buy Stocks Dashboard</SectionTitle>
        <p className="dashboard-subtitle">
          Manage your stock purchases, track performance, and analyze market opportunities
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
          className={`section-tab ${activeSection === "performance" ? "active" : ""}`}
          onClick={() => setActiveSection("performance")}
        >
          📈 Performance
        </button>
        <button
          className={`section-tab ${activeSection === "watchlist" ? "active" : ""}`}
          onClick={() => setActiveSection("watchlist")}
        >
          ⭐ Watchlist
        </button>
        <button
          className={`section-tab ${activeSection === "plcalc" ? "active" : ""}`}
          onClick={() => setActiveSection("plcalc")}
        >
          🧮 P/L Calc
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
          <GeneralNews onNewsLoaded={onNewsLoaded} />
          <PortfolioInput portfolio={portfolio} setPortfolio={setPortfolio} />
          <FilteredNews
            portfolio={portfolio}
            news={filteredNews}
            loading={loadingNews}
            error={errorNews}
          />
          <SentimentAnalysis portfolio={portfolio} />
          <BuyOrderHistory />
        </>
      )}

      {activeSection === "performance" && (
        <PortfolioPerformance />
      )}

      {activeSection === "watchlist" && (
        <Watchlist />
      )}

      {activeSection === "plcalc" && (
        <ProfitLossCalculator />
      )}

      {activeSection === "history" && (
        <TransactionHistory />
      )}
    </div>
  );
}

export default BuyingDashboard;

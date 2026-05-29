"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Login from "./components/sections/Login";
import StockUpdates from "./components/sections/StockUpdates";
import StockMarketFeed from "./components/sections/StockMarketFeed";
import BuyingDashboard from "./components/sections/BuyingDashboard";
import SellingDashboard from "./components/sections/SellingDashboard";
import GeneralNews from "./components/sections/GeneralNews";
import PortfolioInput from "./components/sections/PortfolioInput";
import FilteredNews from "./components/sections/FilteredNews";
import SentimentAnalysis from "./components/sections/SentimentAnalysis";
import "./App.css";

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [errorNews, setErrorNews] = useState(null);
  const [generalNewsLoaded, setGeneralNewsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dashboardMode, setDashboardMode] = useState("market"); // "market", "updates", "buying", or "selling"

  const fetchFilteredNews = async () => {
    if (portfolio.length === 0) {
      setFilteredNews([]);
      setErrorNews(null);
      return;
    }
    setLoadingNews(true);
    setErrorNews(null);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${baseUrl}/api/news/portfolio`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setFilteredNews(data.data);
        if (data.data.length === 0) {
          setErrorNews("No relevant news found for your portfolio stocks.");
        }
      } else {
        setFilteredNews([]);
        setErrorNews(data.message || "No news found.");
      }
    } catch (err) {
      setFilteredNews([]);
      setErrorNews("Failed to fetch portfolio news.");
      console.error("Portfolio news error:", err);
    } finally {
      setLoadingNews(false);
    }
  };

  const updatePortfolio = async (newPortfolio) => {
    setPortfolio(newPortfolio);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      await fetch(`${baseUrl}/api/portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stocks: newPortfolio }),
      });
    } catch (err) {
      console.error("Portfolio update error:", err);
    }
    // Fetch filtered news after portfolio is updated
    if (newPortfolio.length > 0 && generalNewsLoaded) {
      fetchFilteredNews();
    }
  };

  // Fetch portfolio on app load
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        const res = await fetch(`${baseUrl}/api/portfolio`);
        const data = await res.json();
        if (data.success && Array.isArray(data.portfolio)) {
          setPortfolio(data.portfolio);
        } else {
          setPortfolio([]);
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setPortfolio([]);
      }
    };
    fetchPortfolio();
  }, []);

  // Fetch filtered news when portfolio changes and general news is loaded
  useEffect(() => {
    if (portfolio.length > 0 && generalNewsLoaded) {
      const timer = setTimeout(() => {
        fetchFilteredNews();
      }, 500); // Small delay to ensure general news is fetched first
      return () => clearTimeout(timer);
    }
  }, [portfolio, generalNewsLoaded]);

  if (loading) {
    return (
      <div className="app loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className={`app ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <Header onThemeChange={setIsDarkMode} />
      
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${dashboardMode === "market" ? "active" : ""}`}
          onClick={() => setDashboardMode("market")}
        >
          📈 Live Market Feed
        </button>
        <button
          className={`tab-button ${dashboardMode === "updates" ? "active" : ""}`}
          onClick={() => setDashboardMode("updates")}
        >
          📱 Stock Updates
        </button>
        <button
          className={`tab-button ${dashboardMode === "buying" ? "active" : ""}`}
          onClick={() => setDashboardMode("buying")}
        >
          💰 Buy Stocks
        </button>
        <button
          className={`tab-button ${dashboardMode === "selling" ? "active" : ""}`}
          onClick={() => setDashboardMode("selling")}
        >
          💵 Sell Stocks
        </button>
      </div>

      <main className="app-main">
        {dashboardMode === "market" && (
          <StockMarketFeed />
        )}

        {dashboardMode === "updates" && (
          <StockUpdates
            portfolio={portfolio}
            setPortfolio={updatePortfolio}
            onNewsLoaded={() => setGeneralNewsLoaded(true)}
          />
        )}

        {dashboardMode === "buying" && (
          <BuyingDashboard
            portfolio={portfolio}
            setPortfolio={updatePortfolio}
            filteredNews={filteredNews}
            loadingNews={loadingNews}
            errorNews={errorNews}
            generalNewsLoaded={generalNewsLoaded}
            onNewsLoaded={() => setGeneralNewsLoaded(true)}
          />
        )}

        {dashboardMode === "selling" && (
          <SellingDashboard portfolio={portfolio} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import NewsItem from "../common/NewsItem";

function GeneralNews({ onNewsLoaded }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Use environment variable for backend URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    fetch(`${baseUrl}/api/news/general`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch news`);
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response. Check backend is running.");
        }
        return res.json();
      })
      .then((data) => {
        // Check if data is an array (direct response) or object with data property
        let newsArray = [];
        if (Array.isArray(data)) {
          newsArray = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          newsArray = data.data;
        } else if (data && data.success === false) {
          setError(data.message || "Failed to fetch news");
          newsArray = [];
        } else {
          setError("API did not return a news array");
          newsArray = [];
        }
        
        setNews(newsArray);
        if (onNewsLoaded) onNewsLoaded();
      })
      .catch((err) => {
        console.error("News fetch error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [onNewsLoaded]);

  return (
    <Card>
      <SectionTitle>📢 General Market News</SectionTitle>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>Error: {error}</div>
      ) : (
        <div className="news-list">
          {news.map((item, idx) => (
            <NewsItem key={item.id || item.url || idx} news={item} />
          ))}
        </div>
      )}
    </Card>
  );
}

export default GeneralNews;

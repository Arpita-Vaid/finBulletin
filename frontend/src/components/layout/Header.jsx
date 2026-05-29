import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"

function Header({ onThemeChange }) {
  const [isDark, setIsDark] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark
    
    setIsDark(shouldBeDark)
    if (onThemeChange) onThemeChange(shouldBeDark)
  }, [onThemeChange])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
    if (onThemeChange) onThemeChange(newTheme)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <img src="/logo.svg" alt="FinBulletin Logo" className="header-logo" />
          <div className="brand-text">
            <h1>FinBulletin</h1>
            <p>Real-time stock insights & portfolio tracker</p>
          </div>
        </div>
        <div className="header-actions">
          {user && (
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              <button className="logout-button" onClick={handleLogout} title="Logout">
                Logout
              </button>
            </div>
          )}
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark/light mode">
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

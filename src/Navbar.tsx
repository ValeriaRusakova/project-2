// קומפוננטת Navbar - תפריט ניווט ראשי
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Props - מקבלת את ערך החיפוש ופונקציה לעדכון
interface NavbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

function Navbar({ searchValue, onSearchChange }: NavbarProps) {
  // State למוד כהה/בהיר
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  // עדכון ה-theme בעת שינוי
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  return (
    <nav className="navbar">
      {/* לינקים לדפים */}
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/reports" className="nav-link">Reports</Link>
        <Link to="/recommendations" className="nav-link">Recommendations</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>
      
      {/* תיבת חיפוש וכפתור מוד */}
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search coins..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

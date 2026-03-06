// קומפוננטת Navbar - תפריט ניווט ראשי
import { Link } from 'react-router-dom';

// Props - מקבלת את ערך החיפוש ופונקציה לעדכון
interface NavbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

function Navbar({ searchValue, onSearchChange }: NavbarProps) {
  return (
    <nav className="navbar">
      {/* לינקים לדפים */}
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/reports" className="nav-link">Reports</Link>
        <Link to="/recommendations" className="nav-link">Recommendations</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>
      
      {/* תיבת חיפוש */}
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search coins..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
    </nav>
  );
}

export default Navbar;

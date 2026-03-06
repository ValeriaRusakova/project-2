// קובץ ראשי - App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// קומפוננטות
import Navbar from './Navbar';
import Header from './Header';

// דפים
import HomePage from './HomePage';
import ReportsPage from './ReportsPage';
import RecommendationsPage from './RecommendationsPage';
import AboutPage from './AboutPage';

function App() {
  // State לחיפוש
  const [searchValue, setSearchValue] = useState('');

  return (
    <BrowserRouter>
      <div className="app">
        {/* תפריט ניווט */}
        <Navbar 
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        
        {/* כותרת עם Parallax */}
        <Header />
        
        {/* תוכן ראשי - ניתוב */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage searchValue={searchValue} />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

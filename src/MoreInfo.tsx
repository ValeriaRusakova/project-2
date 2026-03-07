// קומפוננטת MoreInfo - הצגת מחירים בלחיצה
import { useState, useEffect } from 'react';

// טיפוס למחירים
interface Prices {
  usd: number;
  eur: number;
  ils: number;
}

// Props
interface MoreInfoProps {
  coinSymbol: string;
  isOpen: boolean;
  onClose: () => void;
}

// Cache למחירים - מונע קריאות מיותרות
const pricesCache: { [key: string]: { prices: Prices; timestamp: number } } = {};
const CACHE_DURATION = 60000; // 60 שניות

function MoreInfo({ coinSymbol, isOpen, onClose }: MoreInfoProps) {
  // State למחירים
  const [prices, setPrices] = useState<Prices | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // טעינת מחירים מה-API
  useEffect(() => {
    if (isOpen && coinSymbol) {
      // בדיקה אם יש ב-cache
      const cached = pricesCache[coinSymbol];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setPrices(cached.prices);
        return;
      }

      setLoading(true);
      setError('');
      
      // שימוש ב-CryptoCompare API במקום CoinGecko (אין rate limiting)
      fetch(`https://min-api.cryptocompare.com/data/price?fsym=${coinSymbol.toUpperCase()}&tsyms=USD,EUR,ILS`)
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch');
          return response.json();
        })
        .then((data) => {
          const newPrices = {
            usd: data.USD || 0,
            eur: data.EUR || 0,
            ils: data.ILS || 0,
          };
          setPrices(newPrices);
          // שמירה ב-cache
          pricesCache[coinSymbol] = { prices: newPrices, timestamp: Date.now() };
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load prices');
          setLoading(false);
        });
    }
  }, [coinSymbol, isOpen]);

  // אם לא פתוח - לא מציגים
  if (!isOpen) return null;

  return (
    <div className="more-info">
      {loading && <p>Loading...</p>}
      
      {error && <p className="error">{error}</p>}
      
      {prices && (
        <div className="prices">
          <p>💵 USD: ${prices.usd.toLocaleString()}</p>
          <p>💶 EUR: €{prices.eur.toLocaleString()}</p>
          <p>💰 ILS: ₪{prices.ils.toLocaleString()}</p>
        </div>
      )}
      
      <button onClick={onClose} className="close-info-btn">
        Close
      </button>
    </div>
  );
}

export default MoreInfo;

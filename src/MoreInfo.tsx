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
  coinId: string;
  isOpen: boolean;
  onClose: () => void;
}

function MoreInfo({ coinId, isOpen, onClose }: MoreInfoProps) {
  // State למחירים
  const [prices, setPrices] = useState<Prices | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // טעינת מחירים מה-API
  useEffect(() => {
    if (isOpen && coinId) {
      setLoading(true);
      setError('');
      
      fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch');
          return response.json();
        })
        .then((data) => {
          setPrices({
            usd: data.market_data.current_price.usd,
            eur: data.market_data.current_price.eur,
            ils: data.market_data.current_price.ils,
          });
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load prices');
          setLoading(false);
        });
    }
  }, [coinId, isOpen]);

  // אם לא פתוח - לא מציגים
  if (!isOpen) return null;

  return (
    <div className="more-info">
      {loading && <p>Loading...</p>}
      
      {error && <p className="error">{error}</p>}
      
      {prices && (
        <div className="prices">
          <p>$ {prices.usd.toLocaleString()}</p>
          <p>€ {prices.eur.toLocaleString()}</p>
          <p>₪ {prices.ils.toLocaleString()}</p>
        </div>
      )}
      
      <button onClick={onClose} className="close-info-btn">
        CLOSE INFO
      </button>
    </div>
  );
}

export default MoreInfo;

// דף המלצות AI
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { coinsCache } from './HomePage';

// Cache להמלצות - מונע קריאות מיותרות
const recommendationCache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_DURATION = 300000; // 5 דקות

function RecommendationsPage() {
  const selectedCoins = useSelector((state: any) => state.coins.selectedCoins);
  const [coins, setCoins] = useState<any[]>([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCoins, setLoadingCoins] = useState(true);

  useEffect(() => {
    if (selectedCoins.length === 0) { setLoadingCoins(false); return; }
    
    // שימוש ב-cache
    if (coinsCache) {
      setCoins(coinsCache.filter((c: any) => selectedCoins.includes(c.id)));
      setLoadingCoins(false);
    } else {
      setLoadingCoins(false);
    }
  }, [selectedCoins]);

  const getRecommendation = async () => {
    if (!selectedCoin) return;
    setLoading(true);
    setRecommendation('');
    
    // בדיקה אם יש ב-cache
    const cached = recommendationCache[selectedCoin];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setRecommendation(cached.data);
      setLoading(false);
      return;
    }
    
    try {
      // שימוש בנתונים מה-cache של דף הבית (כבר יש לנו את רוב המידע)
      const coinData = coinsCache?.find((c: any) => c.id === selectedCoin);
      if (!coinData) {
        setRecommendation('Coin data not found');
        setLoading(false);
        return;
      }

      // קבלת מחיר עדכני מ-CryptoCompare (ללא rate limiting)
      const symbol = coinData.symbol.toUpperCase();
      const priceRes = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`);
      const priceData = await priceRes.json();
      
      const info = {
        name: coinData.name,
        price: priceData.USD || coinData.current_price,
        cap: coinData.market_cap,
        vol24h: coinData.total_volume,
        c24h: coinData.price_change_percentage_24h || 0,
      };
      
      // קביעת ההמלצה והסבר בהתבסס על נתונים זמינים
      let rec = '';
      let explanation = '';
      
      if (info.c24h > 2) {
        rec = '✅ Recommended to BUY';
        explanation = `${info.name} מראה מומנטום חיובי עם עלייה של ${info.c24h.toFixed(2)}% ב-24 השעות האחרונות. נפח המסחר היומי של $${info.vol24h.toLocaleString()} מצביע על עניין משמעותי בשוק. זה יכול להיות זמן טוב לרכישה, אך תמיד יש לבצע מחקר נוסף.`;
      } else if (info.c24h < -5) {
        rec = '❌ NOT Recommended to buy';
        explanation = `${info.name} מראה ירידה משמעותית עם שינוי של ${info.c24h.toFixed(2)}% ב-24 שעות. למרות נפח מסחר של $${info.vol24h.toLocaleString()}, מומלץ להמתין להתייצבות המחיר לפני רכישה. שקול לחכות לאיתותים חיוביים יותר.`;
      } else {
        rec = '⚠️ HOLD - Wait for better entry';
        explanation = `${info.name} מראה אותות מעורבים. המחיר הנוכחי הוא $${info.price.toLocaleString()} עם שינוי של ${info.c24h.toFixed(2)}% ב-24 שעות. נפח המסחר היומי הוא $${info.vol24h.toLocaleString()}. מומלץ להמתין לכיוון ברור יותר בשוק לפני קבלת החלטה.`;
      }
      
      const result = `${rec}

📊 Analysis for ${info.name}:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Current Price: $${info.price.toLocaleString()}
📈 Market Cap: $${info.cap.toLocaleString()}
💹 24h Volume: $${info.vol24h.toLocaleString()}
📅 24h Change: ${info.c24h.toFixed(2)}%

📝 Explanation:
${explanation}`;

      // שמירה ב-cache
      recommendationCache[selectedCoin] = { data: result, timestamp: Date.now() };
      setRecommendation(result);
    } catch { setRecommendation('Failed to get recommendation'); }
    setLoading(false);
  };

  if (selectedCoins.length === 0) {
    return <div className="recommendations-page"><h2>AI Recommendations</h2><p className="no-coins-message">No coins selected.</p></div>;
  }
  if (loadingCoins) return <div className="loading">Loading...</div>;

  return (
    <div className="recommendations-page">
      <h2>AI Recommendations</h2>
      <p>Select a coin:</p>
      <div className="coin-selection">
        {coins.map((coin) => (
          <div key={coin.id} className="radio-item">
            <input type="radio" id={coin.id} name="coinRec" value={coin.id} checked={selectedCoin === coin.id} onChange={(e) => setSelectedCoin(e.target.value)} />
            <label htmlFor={coin.id}><img src={coin.image} alt={coin.name} className="coin-icon-small" />{coin.symbol.toUpperCase()} - {coin.name}</label>
          </div>
        ))}
      </div>
      <button onClick={getRecommendation} disabled={!selectedCoin || loading} className="get-recommendation-btn">
        {loading ? 'Loading...' : 'Get Recommendation'}
      </button>
      {recommendation && <div className="recommendation-result"><pre>{recommendation}</pre></div>}
    </div>
  );
}

export default RecommendationsPage;

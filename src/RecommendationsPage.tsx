// דף המלצות AI
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { coinsCache } from './HomePage';

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
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${selectedCoin}?localization=false&tickers=false&community_data=false&developer_data=false`);
      if (res.status === 429) {
        setRecommendation('API rate limited. Please wait a minute.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      const info = {
        name: data.name,
        price: data.market_data.current_price.usd,
        cap: data.market_data.market_cap.usd,
        vol24h: data.market_data.total_volume.usd,
        c30: data.market_data.price_change_percentage_30d_in_currency?.usd || 0,
        c60: data.market_data.price_change_percentage_60d_in_currency?.usd || 0,
        c200: data.market_data.price_change_percentage_200d_in_currency?.usd || 0,
      };
      
      // קביעת ההמלצה והסבר
      let rec = '';
      let explanation = '';
      
      if (info.c30 > 0 && info.c200 > 0) {
        rec = '✅ Recommended to BUY';
        explanation = `${info.name} מראה מומנטום חיובי עם עלייה של ${info.c30.toFixed(2)}% ב-30 הימים האחרונים ועלייה של ${info.c200.toFixed(2)}% ב-200 ימים. נפח המסחר היומי הגבוה של $${info.vol24h.toLocaleString()} מצביע על עניין משמעותי בשוק. זה יכול להיות זמן טוב לרכישה, אך תמיד יש לבצע מחקר נוסף.`;
      } else if (info.c30 < -10 || info.c200 < -20) {
        rec = '❌ NOT Recommended to buy';
        explanation = `${info.name} מראה ירידה משמעותית עם שינוי של ${info.c30.toFixed(2)}% ב-30 ימים ו-${info.c200.toFixed(2)}% ב-200 ימים. למרות נפח מסחר של $${info.vol24h.toLocaleString()}, מומלץ להמתין להתייצבות המחיר לפני רכישה. שקול לחכות לאיתותים חיוביים יותר.`;
      } else {
        rec = '⚠️ HOLD - Wait for better entry';
        explanation = `${info.name} מראה אותות מעורבים. המחיר הנוכחי הוא $${info.price.toLocaleString()} עם שינוי של ${info.c30.toFixed(2)}% ב-30 ימים. נפח המסחר היומי הוא $${info.vol24h.toLocaleString()}. מומלץ להמתין לכיוון ברור יותר בשוק לפני קבלת החלטה.`;
      }
      
      setRecommendation(`${rec}

📊 Analysis for ${info.name}:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Current Price: $${info.price.toLocaleString()}
📈 Market Cap: $${info.cap.toLocaleString()}
💹 24h Volume: $${info.vol24h.toLocaleString()}
📅 30-day Change: ${info.c30.toFixed(2)}%
📅 60-day Change: ${info.c60.toFixed(2)}%
📅 200-day Change: ${info.c200.toFixed(2)}%

📝 Explanation:
${explanation}`);
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

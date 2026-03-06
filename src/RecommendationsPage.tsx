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
        vol: data.market_data.total_volume.usd,
        c30: data.market_data.price_change_percentage_30d_in_currency?.usd || 0,
        c60: data.market_data.price_change_percentage_60d_in_currency?.usd || 0,
        c200: data.market_data.price_change_percentage_200d_in_currency?.usd || 0,
      };
      let rec = info.c30 > 0 && info.c200 > 0 ? '✅ Recommended to BUY' : info.c30 < -10 ? '❌ NOT Recommended' : '⚠️ HOLD';
      setRecommendation(`${rec}\n\n${info.name}\nPrice: $${info.price.toLocaleString()}\nMarket Cap: $${info.cap.toLocaleString()}\n30d: ${info.c30.toFixed(2)}%\n60d: ${info.c60.toFixed(2)}%\n200d: ${info.c200.toFixed(2)}%`);
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

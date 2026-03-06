// דף הבית - הצגת 100 מטבעות
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CoinList from './CoinList';
import Dialog from './Dialog';

// Cache גלובלי למטבעות
let coinsCache: any[] | null = null;
let cacheTime = 0;

interface HomePageProps {
  searchValue: string;
}

function HomePage({ searchValue }: HomePageProps) {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [pendingCoinId, setPendingCoinId] = useState('');
  const selectedCoins = useSelector((state: any) => state.coins.selectedCoins);

  useEffect(() => {
    // בדיקה אם יש cache תקף (5 דקות)
    const now = Date.now();
    if (coinsCache && now - cacheTime < 300000) {
      setCoins(coinsCache);
      setLoading(false);
      return;
    }

    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1')
      .then((res) => {
        if (res.status === 429) throw new Error('Rate limited');
        return res.json();
      })
      .then((data) => {
        coinsCache = data;
        cacheTime = Date.now();
        setCoins(data);
        setLoading(false);
      })
      .catch(() => {
        setError('API rate limited. Please wait a minute and refresh.');
        setLoading(false);
      });
  }, []);

  const filteredCoins = coins.filter((coin) => {
    const search = searchValue.toLowerCase();
    return coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search);
  });

  const handleMaxCoinsReached = (coinId: string) => {
    setPendingCoinId(coinId);
    setShowDialog(true);
  };

  if (loading) return <div className="loading">Loading coins...</div>;
  if (error) return <div className="error">{error}</div>;

  const selectedCoinDetails = coins.filter((coin) => selectedCoins.includes(coin.id));

  return (
    <div className="home-page">
      <p className="results-count">Showing {filteredCoins.length} coins {searchValue && `for "${searchValue}"`}</p>
      <CoinList coins={filteredCoins} onMaxCoinsReached={handleMaxCoinsReached} />
      <Dialog isOpen={showDialog} selectedCoins={selectedCoinDetails} newCoinId={pendingCoinId} onClose={() => setShowDialog(false)} />
    </div>
  );
}

export default HomePage;
export { coinsCache };

// קומפוננטת CoinList - רשימת כרטיסי מטבעות
import CoinCard from './CoinCard';

interface CoinListProps {
  coins: Array<{
    id: string;
    symbol: string;
    name: string;
    image: string;
  }>;
  onMaxCoinsReached: (coinId: string) => void;
}

function CoinList({ coins, onMaxCoinsReached }: CoinListProps) {
  return (
    <div className="coin-list">
      {coins.map((coin) => (
        <CoinCard key={coin.id} coin={coin} onMaxCoinsReached={onMaxCoinsReached} />
      ))}
    </div>
  );
}

export default CoinList;

// קומפוננטת CoinCard - כרטיס מטבע בודד
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCoin, removeCoin } from './store';
import MoreInfo from './MoreInfo';

interface CoinCardProps {
  coin: {
    id: string;
    symbol: string;
    name: string;
    image: string;
  };
  onMaxCoinsReached: (coinId: string) => void;
}

function CoinCard({ coin, onMaxCoinsReached }: CoinCardProps) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const selectedCoins = useSelector((state: any) => state.coins.selectedCoins);
  const dispatch = useDispatch();
  const isSelected = selectedCoins.includes(coin.id);

  const handleToggle = () => {
    if (isSelected) {
      dispatch(removeCoin(coin.id));
    } else {
      if (selectedCoins.length >= 5) {
        onMaxCoinsReached(coin.id);
      } else {
        dispatch(addCoin(coin.id));
      }
    }
  };

  return (
    <div className="coin-card">
      <div className="coin-card-header">
        <img src={coin.image} alt={coin.name} className="coin-icon" />
        <label className="switch">
          <input type="checkbox" checked={isSelected} onChange={handleToggle} />
          <span className="slider"></span>
        </label>
      </div>
      <div className="coin-card-body">
        <h3 className="coin-symbol">{coin.symbol.toUpperCase()}</h3>
        <p className="coin-name">{coin.name}</p>
      </div>
      <button className="more-info-btn" onClick={() => setShowMoreInfo(!showMoreInfo)}>
        {showMoreInfo ? 'CLOSE INFO' : 'MORE INFO'}
      </button>
      <MoreInfo coinId={coin.id} isOpen={showMoreInfo} onClose={() => setShowMoreInfo(false)} />
    </div>
  );
}

export default CoinCard;

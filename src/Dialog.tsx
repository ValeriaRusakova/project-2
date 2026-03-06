// קומפוננטת Dialog - בחירת מטבע להחלפה
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { replaceCoin, addCoin } from './store';

interface DialogProps {
  isOpen: boolean;
  selectedCoins: Array<{ id: string; symbol: string; name: string }>;
  newCoinId: string;
  onClose: () => void;
}

function Dialog({ isOpen, selectedCoins, newCoinId, onClose }: DialogProps) {
  const dispatch = useDispatch();
  const [selectedToRemove, setSelectedToRemove] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedToRemove) {
      dispatch(replaceCoin({ oldCoinId: selectedToRemove, newCoinId }));
      dispatch(addCoin(newCoinId));
      setSelectedToRemove('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedToRemove('');
    onClose();
  };

  return (
    <div className="dialog-overlay" onClick={handleClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2>Maximum Coins Reached</h2>
        <p>You can select up to 5 coins. Choose one to remove:</p>
        <div className="dialog-coins">
          {selectedCoins.map((coin) => (
            <div key={coin.id} className="dialog-coin-item">
              <input
                type="radio"
                name="coinToRemove"
                id={`remove-${coin.id}`}
                checked={selectedToRemove === coin.id}
                onChange={() => setSelectedToRemove(coin.id)}
              />
              <label htmlFor={`remove-${coin.id}`}>
                {coin.symbol.toUpperCase()} - {coin.name}
              </label>
            </div>
          ))}
        </div>
        <div className="dialog-buttons">
          <button onClick={handleConfirm} className="dialog-confirm-btn" disabled={!selectedToRemove}>
            CONFIRM
          </button>
          <button onClick={handleClose} className="dialog-close-btn">CLOSE</button>
        </div>
      </div>
    </div>
  );
}

export default Dialog;

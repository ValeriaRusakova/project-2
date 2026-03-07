// דף דוחות - גרף זמן אמת בסגנון נרות
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { coinsCache } from './HomePage';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function ReportsPage() {
  const selectedCoins = useSelector((state: any) => state.coins.selectedCoins);
  const [chartData, setChartData] = useState<any>({});
  const [symbols, setSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const intervalRef = useRef<number | null>(null);
  const prevPrices = useRef<any>({});
  const counterRef = useRef(0);

  useEffect(() => {
    if (selectedCoins.length === 0) {
      setLoading(false);
      return;
    }

    if (coinsCache) {
      const syms: string[] = [];
      coinsCache.forEach((coin: any) => {
        if (selectedCoins.includes(coin.id)) {
          syms.push(coin.symbol.toUpperCase());
        }
      });
      setSymbols(syms);
      if (syms.length > 0) setSelectedSymbol(syms[0]);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [selectedCoins]);

  const fetchPrices = async () => {
    if (symbols.length === 0) return;
    try {
      const res = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols.join(',')}&tsyms=USD`);
      const data = await res.json();
      counterRef.current += 1;
      const time = new Date().toLocaleTimeString();
      
      setChartData((prev: any) => {
        const newData = { ...prev };
        symbols.forEach((s) => {
          const currentPrice = data[s]?.USD || 0;
          const prevPrice = prevPrices.current[s] || currentPrice;
          
          const variation = currentPrice * 0.0003;
          const open = prevPrice;
          const close = currentPrice + (Math.random() - 0.5) * variation;
          const high = Math.max(open, close) + (Math.random() * variation);
          const low = Math.min(open, close) - (Math.random() * variation);
          
          const candle = {
            index: counterRef.current,
            time,
            open,
            close,
            high,
            low,
            color: close >= open ? '#26a69a' : '#ef5350',
            body: [Math.min(open, close), Math.max(open, close)],
          };
          
          if (!newData[s]) newData[s] = [];
          newData[s] = [...newData[s].slice(-29), candle];
          prevPrices.current[s] = close;
        });
        return newData;
      });
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (symbols.length > 0) {
      fetchPrices();
      intervalRef.current = window.setInterval(fetchPrices, 1000); // כל שנייה
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [symbols]);

  if (selectedCoins.length === 0) {
    return (
      <div className="reports-page">
        <h2>דו"ח זמן אמת</h2>
        <p className="no-coins-message">לא נבחרו מטבעות. עבור לדף הבית ובחר מטבעות.</p>
      </div>
    );
  }

  if (loading) return <div className="loading">טוען...</div>;

  const currentData = chartData[selectedSymbol] || [];

  return (
    <div className="reports-page">
      <h2>דו"ח זמן אמת</h2>
      
      <div className="symbol-tabs">
        {symbols.map((s) => (
          <button
            key={s}
            className={`symbol-tab ${selectedSymbol === s ? 'active' : ''}`}
            onClick={() => setSelectedSymbol(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="chart-container candlestick-chart">
        <h3 className="chart-title">{selectedSymbol}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="candle-tooltip">
                      <p><strong>{d.time}</strong></p>
                      <p>Open: ${d.open?.toFixed(2)}</p>
                      <p>Close: ${d.close?.toFixed(2)}</p>
                      <p>High: ${d.high?.toFixed(2)}</p>
                      <p>Low: ${d.low?.toFixed(2)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="body" barSize={8}>
              {currentData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ReportsPage;

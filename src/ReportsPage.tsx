// דף דוחות - גרף זמן אמת
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { coinsCache } from './HomePage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#f7931a', '#627eea', '#26a17b', '#2775ca', '#c3a634'];

function ReportsPage() {
  const selectedCoins = useSelector((state: any) => state.coins.selectedCoins);
  const [chartData, setChartData] = useState<any[]>([]);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (selectedCoins.length === 0) {
      setLoading(false);
      return;
    }

    // שימוש ב-cache במקום קריאה חדשה
    if (coinsCache) {
      const syms: string[] = [];
      coinsCache.forEach((coin: any) => {
        if (selectedCoins.includes(coin.id)) {
          syms.push(coin.symbol.toUpperCase());
        }
      });
      setSymbols(syms);
      setLoading(false);
    } else {
      // אם אין cache, ממתינים
      setLoading(false);
    }
  }, [selectedCoins]);

  const fetchPrices = async () => {
    if (symbols.length === 0) return;
    try {
      const res = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols.join(',')}&tsyms=USD`);
      const data = await res.json();
      const newPoint: any = { time: new Date().toLocaleTimeString() };
      Object.keys(data).forEach((s) => { newPoint[s] = data[s].USD; });
      setChartData((prev) => [...prev.slice(-19), newPoint]);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (symbols.length > 0) {
      fetchPrices();
      intervalRef.current = window.setInterval(fetchPrices, 2000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [symbols]);

  if (selectedCoins.length === 0) {
    return (
      <div className="reports-page">
        <h2>Real-Time Reports</h2>
        <p className="no-coins-message">No coins selected. Go to Home and select coins.</p>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="reports-page">
      <h2>Real-Time Reports</h2>
      <p>Live prices for: {symbols.join(', ')}</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            {symbols.map((s, i) => (
              <Line key={s} type="monotone" dataKey={s} stroke={COLORS[i % 5]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ReportsPage;

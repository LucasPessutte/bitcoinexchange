import { useEffect, useState } from 'react';
import api from '../api/api.js';
import socket from '../services/socket.js';

function MyHistory() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTrades = async () => {
    try {
      const response = await api.get('/api/trades/history');
      setTrades(response.data);
    } catch (error) {
      console.error('Error fetching trade history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTrades();
    socket.on('statisticsUpdated', () => {
      fetchMyTrades();
    });
    return () => {
      socket.off('statsUpdated');
    };
  }, []);

  if (loading) {
    return <div className="container mt-5"><p>Loading trade history...</p></div>;
  }

  return (
    <div className="container mt-5">
      <h1>My Trade History</h1>

      {trades.length === 0 ? (
        <p>No trades found.</p>
      ) : (
        <table className="table table-striped mt-4">
          <thead className="thead-dark">
            <tr>
              <th>Type</th>
              <th>Price (USD)</th>
              <th>Amount (BTC)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => (
              <tr key={trade.id}>
                <td className={trade.buyer_id === JSON.parse(localStorage.getItem('user')).id ? 'text-success' : 'text-danger'}>
                  {trade.buyer_id === JSON.parse(localStorage.getItem('user')).id ? 'Buy' : 'Sell'}
                </td>
                <td>${parseFloat(trade.price).toFixed(2)}</td>
                <td>{parseFloat(trade.amount).toFixed(4)} BTC</td>
                <td>{new Date(trade.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyHistory;
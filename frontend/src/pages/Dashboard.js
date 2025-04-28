import { useEffect, useState } from 'react';
import api from '../api/api.js';
import socket from '../services/socket.js';

function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [trades, setTrades] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchStatistics();
    fetchTrades();
    socket.on('statisticsUpdated', () => {
      fetchTrades();
      fetchStatistics();
    });
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    return () => {
      socket.off('statsUpdated');
    };
  }, []);

  

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/api/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchTrades = async () => {
    try {
      const response = await api.get('/api/trades/recent');
      setTrades(response.data);
    } catch (error) {
      console.error('Erro ao buscar trades:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>

      {/* Cards de Estatísticas */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Last Price</div>
            <div className="card-body">
              <h5 className="card-title">
                {statistics ? `$${statistics.lastPrice}` : 'Loading...'}
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">BTC Volume (24h)</div>
            <div className="card-body">
              <h5 className="card-title">
                {statistics ? `${statistics.btcVolume} BTC` : 'Loading...'}
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-header">USD Volume (24h)</div>
            <div className="card-body">
              <h5 className="card-title">
                {statistics ? `$${statistics.usdVolume}` : 'Loading...'}
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-white bg-info mb-3">
            <div className="card-header">High (24h)</div>
            <div className="card-body">
              <h5 className="card-title">
                {statistics ? `$${statistics.high}` : 'Loading...'}
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-white bg-danger mb-3">
            <div className="card-header">Low (24h)</div>
            <div className="card-body">
              <h5 className="card-title">
                {statistics ? `$${statistics.low}` : 'Loading...'}
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card text-dark bg-light mb-3">
            <div className="card-header">Your Balances</div>
            <div className="card-body">
              <h5 className="card-title">
                {statistics ? `USD: $${parseFloat(statistics.user_usd_balance).toFixed(2)} | BTC: ${parseFloat(statistics.user_btc_balance).toFixed(2)} BTC` : 'Loading...'}
              </h5>
            </div>
          </div>
        </div>
      </div>

      {/* Table Global Matches */}
      <h2 className="mt-5">Global Matches</h2>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Price (USD)</th>
            <th>Amount (BTC)</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id}>
              <td>${parseFloat(trade.price).toFixed(2)}</td>
              <td>{parseFloat(trade.amount).toFixed(4)} BTC</td>
              <td>{new Date(trade.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;

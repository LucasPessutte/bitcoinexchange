import { useEffect, useState } from 'react';
import api from '../api/api.js';
import {useNavigate} from 'react-router-dom';

function OrderBook() {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchOrderBook = async () => {
    try {
      const response = await api.get('/api/orders/orderbook');
      setBids(response.data.bids);
      setAsks(response.data.asks);
    } catch (error) {
      console.error('Error fetching order book:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderBook();
  }, []);

  if (loading) {
    return <div className="container mt-5"><p>Loading order book...</p></div>;
  }

  return (
    <div className="container mt-5">
      <h1>Order Book</h1>
      <div className="row mt-4">
        <div className="col-md-6">
          <h2>Bids (Buy Orders)</h2>
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Price (USD)</th>
                <th>Amount (BTC)</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid, index) => (
                <tr key={index} onClick={() => navigate('/new-order', { state: { type: 'sell', price: bid.price, amount: bid.totalAmount } })}>
                  <td className="text-success">${parseFloat(bid.price).toFixed(2)}</td>
                  <td>{parseFloat(bid.totalAmount).toFixed(4)} BTC</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-6">
          <h2>Asks (Sell Orders)</h2>
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Price (USD)</th>
                <th>Amount (BTC)</th>
              </tr>
            </thead>
            <tbody>
              {asks.map((ask, index) => (
                <tr key={index} onClick={() => navigate('/new-order', { state: { type: 'buy', price: ask.price, amount: ask.totalAmount } })}>
                  <td className="text-danger">${parseFloat(ask.price).toFixed(2)}</td>
                  <td>{parseFloat(ask.totalAmount).toFixed(4)} BTC</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderBook;
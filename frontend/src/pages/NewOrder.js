import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/api.js';
import Swal from 'sweetalert2';

function NewOrder() {
  const location = useLocation();
  const { state } = location || {};

  const [buyAmount, setBuyAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [activeTab, setActiveTab] = useState('buy');

  useEffect(() => {
    if (state) {
      if (state.type === 'buy') {
        setActiveTab('buy');
        setBuyPrice(state.price || '');
        setBuyAmount(state.amount || '');
      } else if (state.type === 'sell') {
        setActiveTab('sell');
        setSellPrice(state.price || '');
        setSellAmount(state.amount || '');
      }
    }
  }, [state]);

  const handleBuy = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/orders/buy', {
        type: 'buy',
        amount: parseFloat(buyAmount),
        price: parseFloat(buyPrice),
      });
      Swal.fire('Success', 'Buy order created successfully!', 'success');
      setBuyAmount('');
      setBuyPrice('');
    } catch (error) {
      Swal.fire('Error', 'Failed to create buy order.', 'error');
      console.error('Error sending buy order:', error);
    }
  };

  const handleSell = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/orders/sell', {
        type: 'sell',
        amount: parseFloat(sellAmount),
        price: parseFloat(sellPrice),
      });
      Swal.fire('Success', 'Sell order created successfully!', 'success');
      setSellAmount('');
      setSellPrice('');
    } catch (error) {
      Swal.fire('Error', 'Failed to create sell order.', 'error');
      console.error('Error sending sell order:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>New Order</h1>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-4">
            <h3>Buy BTC</h3>
            <form onSubmit={handleBuy}>
              <div className="form-group mb-2">
                <label>Amount (BTC)</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-control"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-2">
                <label>Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Total (USD)</label>
                <input
                  type="text"
                  className="form-control"
                  value={buyAmount && buyPrice ? (buyAmount * buyPrice).toFixed(2) : ''}
                  disabled
                />
              </div>
              <button type="submit" className="btn btn-success w-100">Send Buy Order</button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4">
            <h3>Sell BTC</h3>
            <form onSubmit={handleSell}>
              <div className="form-group mb-2">
                <label>Amount (BTC)</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-control"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-2">
                <label>Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Total (USD)</label>
                <input
                  type="text"
                  className="form-control"
                  value={sellAmount && sellPrice ? (sellAmount * sellPrice).toFixed(2) : ''}
                  disabled
                />
              </div>
              <button type="submit" className="btn btn-danger w-100">Send Sell Order</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewOrder;

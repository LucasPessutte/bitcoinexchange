import Swal from 'sweetalert2';
import { useState } from 'react';
import api from '../api/api.js';

function NewOrder() {
  const [buyAmount, setBuyAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  const handleBuy = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/orders/buy', {
        type: 'buy',
        amount: parseFloat(buyAmount),
        price: parseFloat(buyPrice),
      });

      Swal.fire({
        title: 'Purchase Order',
        text: 'Purchase order submitted successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      setBuyAmount('');
      setBuyPrice('');
    } catch (error) {
      console.error('Error sending purchase order:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to submit purchase order.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
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

      Swal.fire({
        title: 'Sell Order',
        text: 'Sell order submitted successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      setSellAmount('');
      setSellPrice('');
    } catch (error) {
      console.error('Error sending sell order:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to submit sell order.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="container mt-5">
      <h1>Nova Ordem</h1>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-4">
            <h3>Comprar BTC</h3>
            <form onSubmit={handleBuy}>
              <div className="form-group mb-2">
                <label>Quantidade (BTC)</label>
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
                <label>Preço (USD)</label>
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
              <button type="submit" className="btn btn-success w-100">Enviar Ordem de Compra</button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4">
            <h3>Vender BTC</h3>
            <form onSubmit={handleSell}>
              <div className="form-group mb-2">
                <label>Quantidade (BTC)</label>
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
                <label>Preço (USD)</label>
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
              <button type="submit" className="btn btn-danger w-100">Enviar Ordem de Venda</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewOrder;
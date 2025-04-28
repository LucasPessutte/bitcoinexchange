import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../api/api.js';
import socket from '../services/socket.js'

function MyActiveOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveOrders = async () => {
    try {
      const response = await api.get('/api/orders/active');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching active orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
  
    socket.on('orderCancelled', (data) => {
      console.log('Order cancelled event received:', data);
      fetchActiveOrders();
    });
  
    return () => {
      socket.off('orderCancelled');
    };
  }, []);
  
  const handleCancelOrder = async (id) => {
    try {
      await api.delete(`/api/orders/cancel/${id}`);
      Swal.fire({
        title: 'Order Cancelled',
        text: 'The order was successfully cancelled.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to cancel the order.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  if (loading) {
    return <div className="container mt-5"><p>Loading active orders...</p></div>;
  }

  return (
    <div className="container mt-5">
      <h1>My Active Orders</h1>
      {orders.length === 0 ? (
        <p>No active orders found.</p>
      ) : (
        <table className="table table-bordered mt-4">
          <thead className="thead-dark">
            <tr>
              <th>Type</th>
              <th>Amount (BTC)</th>
              <th>Price (USD)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className={order.type === 'buy' ? 'text-success' : 'text-danger'}>
                  {order.type.toUpperCase()}
                </td>
                <td>{order.amount}</td>
                <td>{order.price}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyActiveOrders;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.js';
import Dashboard from './pages/Dashboard.js';
import NewOrder from './pages/NewOrder.js';
import MyActiveOrders from './pages/MyActiveOrders.js';
import ProtectedLayout from './layouts/ProtectedLayout.js';
import PrivateRoute from './components/PrivateRoute.js';
import MyHistory from './pages/MyHistory.js';
import OrderBook from './pages/OrderBook.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          } />
          <Route path="/new-order" element={
            <ProtectedLayout>
              <NewOrder />
            </ProtectedLayout>
          } />
          <Route path="/active-orders" element={
            <ProtectedLayout >
              <MyActiveOrders />
            </ProtectedLayout>
            } 
          />
          <Route path="/my-history" element={
            <ProtectedLayout >
              <MyHistory />
            </ProtectedLayout>
            } 
          />
          <Route path="/orderbook" element={
            <ProtectedLayout>
              <OrderBook />
            </ProtectedLayout>
            } 
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;



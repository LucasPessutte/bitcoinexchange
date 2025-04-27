import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.js';
import Dashboard from './pages/Dashboard.js';
import NewOrder from './pages/NewOrder.js'; // <- Novo arquivo
import ProtectedLayout from './layouts/ProtectedLayout.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
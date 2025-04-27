import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.js';

function ProtectedLayout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        {children}
      </div>
    </>
  );
}

export default ProtectedLayout;
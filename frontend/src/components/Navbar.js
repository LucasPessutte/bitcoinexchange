import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsername(parsedUser.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Platform Name */}
        <Link className="navbar-brand" to="/dashboard">Bitcoin Exchange</Link>

        {/* Buttons rigth */}
        <div className="d-flex align-items-center ms-auto">
          <Link to="/new-order" className="btn btn-outline-light me-2">
            Nova Ordem
          </Link>
          <Link className="btn btn-outline-light me-2" to="/active-orders">
            My Active Orders
          </Link>
          <Link className="btn btn-outline-light me-2" to="/my-history">
            My History
          </Link>
          <Link className="btn btn-outline-light me-2" to="/orderbook">
            Order Book
          </Link>

          {/* button logout */}
          <button className="btn btn-outline-danger me-2" onClick={handleLogout}>
            Logout
          </button>

            {/* User name */}
            {username && (
            <span className="navbar-text text-light">
              Usuário: {username}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

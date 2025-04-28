import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Nome da plataforma como link */}
        <Link className="navbar-brand" to="/dashboard">Bitcoin Exchange</Link>

        {/* Botões do lado direito */}
        <div className="d-flex ms-auto">
          <Link to="/new-order" className="btn btn-outline-light me-2">
            Nova Ordem
          </Link>
          <Link className="btn btn-outline-light me-2" to="/active-orders">
            My Active Orders
          </Link>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import '../styles/home/dashboard.scss';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/home/dashboard.scss';
import { useLoading } from '../context/LoadingContext';
import { logout} from '../services/AuthServices';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
    console.log(localStorage.getItem('jwtToken'));
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    const { user, logout } = useAuth();
  
    useEffect(() => {
      document.title = 'Sveiki atvykę';

      const jwt = accessToken || localStorage.getItem('jwtToken');

      if (!jwt) {
        navigate('/login');
      }
    }, [accessToken, navigate]);
  
    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout(); // Use context logout
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };
  


  return (
    <main className="content">
      <div className="dashboard-wrapper">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h4 className="text-white">Meniu</h4>
          </div>
          <ul className="nav flex-column">
            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="nav-link text-white w-100 text-start"
              >
                <i className="bi bi-box-arrow-right me-2"></i> Atsijungti
              </button>
            </li>
          </ul>
        </nav>

        <div className="main-content">
          <div className="container-fluid p-4">
            <h1 className="dashboard-title">Pagrindinis</h1>
            <p className="lead text-muted">Sveiki atvykę! Valdykite savo filmus efektyviai.</p>

            <div className="row row-cols-1 row-cols-md-2 g-4">
              <div className="col">
                <div className="card h-100">
                  <div className="card-body">
                  <h5 className="card-title">Filmų sąrašas</h5>
                    <p className="card-text">Peržiūrėkite visus filmus.</p>
                    <Link to="/movies" className="btn btn-primary">
                      Žiūrėti filmų sąrašą
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card h-100">
                  <div className="card-body">
                  <h5 className="card-title">Kategorijų sąrašas</h5>
                    <p className="card-text">Peržiūrėkite visas kategorijas.</p>
                    <Link to="/categories" className="btn btn-primary">
                      Žiūrėti kategorijų sąrašą
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Atsiliepimai</h5>
                    <p className="card-text">Stebėkit atsliepimus.</p>
                    <Link to="/reviews" className="btn btn-primary">
                      Eiti į atsiliepimus
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
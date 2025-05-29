import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/base/header.scss';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [username, setUsername] = useState(null);
  const [roles, setRoles] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
    const storedRoles = localStorage.getItem('roles');
    setRoles(storedRoles);
  }, []);

  
    const isAdmin = () => {
      if (!roles) return false;
      
      
      if (Array.isArray(roles)) {
        return roles.includes('ROLE_ADMIN');
      }
      
      return roles.includes('ROLE_ADMIN');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-primary">
        <div className="container">
          <Link className="logo-title" to="/">Movie Application</Link>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link className='nav-link' to="/">Pagrindinis</Link>
                  </li>
                  <li className="nav-item">
                    <Link className='nav-link' to="/login">Prisijungti</Link>
                  </li>
                  <li className="nav-item">
                    <Link className='nav-link' to="/register">Registracija</Link>
                  </li>
                    {isAdmin() && (
                      <li className="nav-item">
                        <Link className='nav-link UsersNav' to="/users">Vartotojai</Link>
                      </li>
                    )}
                </ul>
                {username && (
                  <span className="text-white UserInfo">
                    Prisijungęs vartotojas: <strong>{username}</strong>
                  </span>
                )}
                {roles && (
                  <span className="text-white UserInfo-roles">
                    Rolės: <strong>{roles}</strong>
                  </span>
                )}
            </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
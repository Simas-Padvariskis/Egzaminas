import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/user/user.scss';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); 

  useEffect(() => {
    document.title = 'Prisijungimas';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoading(true);
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Prašome užpildyti visus laukus.');
      setIsLoading(false);
      setLoading(false);
      return;
    }

    try {
      await login(email, password); // uses context, which updates accessToken in state
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Prisijungimas</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">Vartotojo paštas</label>
        <input
          type="text"
          id="username"
          name="username"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <label htmlFor="password">Slaptažodis</label>
        <input
          type="password"
          id="password"
          name="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button type="submit" className='btn-submit' disabled={isLoading}>
          {isLoading ? 'Prisijungiama...' : 'Prisijungti'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <div className="form-footer">
        Neturite paskyros? <Link to="/register">Užsiregistruokite</Link> <br />
      </div>
    </div>
  );
}

export default Login;
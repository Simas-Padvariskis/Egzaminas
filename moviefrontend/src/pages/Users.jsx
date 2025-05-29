import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
// import '../styles/admin/users.scss';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const isAdmin = () => {
    if (!user?.roles) return false;
    
    // Handle both array and string formats
    const rolesArray = Array.isArray(user.roles) 
      ? user.roles
      : typeof user.roles === 'string'
        ? user.roles.split(',') // Handle comma-separated strings
        : [];
    
    // Check for admin role in different possible formats
    return rolesArray.some(role => {
      const normalizedRole = role.trim().toUpperCase();
      return (
        normalizedRole === 'ROLE_ADMIN' || 
        normalizedRole === 'ADMIN' ||
        normalizedRole.endsWith('ADMIN')
      );
    });
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Ar tikrai norite ištrinti šį vartotoją?");
    if (!confirmed) return;

    try {
      setLoading(true);
        const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json',
            },
            });

        if (!response.ok) {
            throw new Error(`Nepavyko ištrinti vartotojo: ${response.status}`);
            }

            // Remove user from state
            setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
        } catch (err) {
            setError(err.message);
            console.error('Klaida trinant vartotoją:', err);
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    if (!isAdmin()) return; // Early return if not admin

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8080/api/v1/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.data || data); // Handle both formats: {data: [...]} or direct array
      } catch (err) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, setLoading, user]); // Added user to dependency array

  if (!isAdmin()) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Neturite teisių peržiūrėti šį puslapį
        </div>
      </div>
    );
  }

  return (
    <main className="users-page">
      <div className="container">
        <h1 className="my-4">Vartotojų valdymas</h1>
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vartotojo vardas</th>
                <th>El. paštas</th>
                <th>Rolės</th>
                <th>Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      {Array.isArray(user.roles) 
                        ? user.roles.join(', ') 
                        : user.roles?.toString() || 'Nėra rolių'}
                    </td>
                    <td>
                      <Link 
                        to={`/users/edit/${user.id}`} 
                        className="btn btn-sm btn-primary me-2"
                      >
                        Redaguoti
                      </Link>
                      <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(user.id)}
                            >
                            Ištrinti
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    {!error && "Vartotojų nerasta"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Users;
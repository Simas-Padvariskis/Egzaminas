import '../styles/home/movies.scss';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';
import { deleteMovie } from '../services/MovieServices';
import { updateMovie } from '../services/MovieServices';
import { createMovie } from '../services/MovieServices';
import { useLoading } from '../context/LoadingContext';
import MovieDetails from '../components/MovieDetails';
import EditMovieModal from '../components/EditMovieModal';

function Movies() {
    const { accessToken, logout } = useAuth();
    const { getMovies} = useMovies();
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [modal, setModal] = useState({ type: null, data: null });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Visos'); 
    
    const openModal = (type, data) => {
        setModal({ type, data });
    };

    useEffect(() => {
        document.title = 'Movie Application - Filmų sąrašas';

        const accessToken = localStorage.getItem('jwtToken');  // Fallback to localStorage

        if (!accessToken) {
            navigate('/login');
        } else {
            fetchMovies();
        }
    }, [navigate]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setModal({ type: null, data: null });
                setSuccess(false);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const fetchMovies = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMovies();
            console.log('Movies data:', data); // Logging movie response
            setMovies(Array.isArray(data) ? data : []); 
            const categories = ['All', ...new Set(movies.map((movie) => movie.category))];
        } catch (err) {
            setError(`Klaida: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const filteredMovies = movies.filter((movie) => {
        const titleMatch = movie.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch =
            selectedCategory === 'Visos' || movie.category === selectedCategory;
        return titleMatch && categoryMatch;
    });


    const handleDeleteMovie = async (movieId) => {
        try {
            await deleteMovie(movieId, accessToken);
            setMovies((prev) => prev.filter((movie) => movie.id !== movieId));
            setSuccess(true);
        } catch (err) {
            setError(`Nepavyko ištrinti filmo: ${err.message}`);
        }
    };

    const handleLogout = () => {
        setLoading(true);
        logout();
        navigate('/');
        setLoading(false);
    };

    if (error) return <p>{error}</p>;

        return (
        <main className="content">
            <div className="dashboard-wrapper">
                <nav className="sidebar">
                    <div className="sidebar-header">
                        <h4 className="text-white Title">Filmų sąrašas</h4>
                    </div>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link to="/dashboard" className="nav-link text-white">Grįžti į Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/categories" className="nav-link text-white">Kategorijų sąrašas</Link>
                        </li>
                        <li className="nav-item">
                            <button onClick={handleLogout} className="nav-link text-white w-100 text-start">Atsijungti</button>
                        </li>
                    </ul>
                </nav>

                <div className="main-content">
                    <div className="container-fluid p-5">
                        <h1 className="title">Filmų sąrašas</h1>
                        <div className="mb-3 d-flex gap-4 flex-wrap align-items-end SearchSection">
                            <div className="d-flex flex-column">
                                <label className="form-label">Ieškoti pagal pavadinimą     </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    style={{ maxWidth: '300px'}}
                                    placeholder="Įveskite pavadinimą..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="d-flex flex-column">
                                <label className="form-label">Ieškoti pagal kategoriją     </label>
                                <select
                                    className="form-select"
                                    style={{ maxWidth: '200px' }}
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {['Visos', ...new Set(movies.map((movie) => movie.category))].map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                className="btn btn-primary mb-3"
                                onClick={() => openModal('create', null)}
                                >
                                Pridėti Filmą
                            </button>
                        </div>
                       
                        {Array.isArray(filteredMovies) && filteredMovies.length > 0 ? (
                            <div className="row row-cols-1 row-cols-md-2 g-4">
                                {filteredMovies.map((movie) => (
                                    <MovieDetails
                                        key={movie.id}
                                        movie={movie}
                                        onEdit={(data) => openModal('update', data)}
                                        onDelete={(data) => openModal('delete', data)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>Filmas nerastas.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal window for deleting a movie*/}
            {modal.type === 'delete' && (
                <div className="modal-backdrop">
                    <div className="modal-content bg-white p-4 rounded shadow">
                        <h5>Ar tikrai norite ištrinti filmą „{modal.data.title}“?</h5>
                        <div className="mt-3 d-flex gap-2">
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    handleDeleteMovie(modal.data.id);
                                    setModal({ type: null, data: null });
                                }}
                            >
                                Taip
                            </button>
                            <button className="btn btn-secondary" onClick={() => setModal({ type: null, data: null })}>
                                Atšaukti
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal window for editing a movie*/}
            {modal.type === 'update' && (
                <EditMovieModal
                    movie={modal.data}
                    onSave={async (updatedMovie) => {
                        try {
                            setLoading(true);
                           
                            await updateMovie(updatedMovie.id, updatedMovie, accessToken);
                           
                            setMovies((prevMovies) =>
                                prevMovies.map((m) => (m.id === updatedMovie.id ? updatedMovie : m))
                            );
                            setSuccess(true);
                        } catch (err) {
                            setError(`Nepavyko atnaujinti filmo: ${err.message}`);
                        } finally {
                            setLoading(false);
                            setModal({ type: null, data: null });
                        }
                    }}
                    onClose={() => setModal({ type: null, data: null })}
                />
            )}

            {/* Modal window for creating a new movie */}
            {modal.type === 'create' && (
                <EditMovieModal
                    movie={null}
                    onSave={async (newMovie) => {
                        try {
                            setLoading(true);
                            const createdMovie = await createMovie(newMovie, accessToken);
                            setMovies((prevMovies) => [...prevMovies, createdMovie]);
                            setSuccess(true);
                        } catch (err) {
                            setError(`Nepavyko sukurti filmo: ${err.message}`);
                        } finally {
                            setLoading(false);
                            setModal({ type: null, data: null });
                        }
                    }}
                    onClose={() => setModal({ type: null, data: null })}
                />
            )}

        </main>
    );
}

export default Movies;
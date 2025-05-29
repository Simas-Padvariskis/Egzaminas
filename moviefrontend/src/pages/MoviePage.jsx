import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMovieById } from '../services/MovieServices';
import { getCommentsByMovieId } from '../services/CommentService';
import CommentSection from '../components/CommentSection';

function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({
    movie: true,
    comments: true
  });

  const fetchData = async () => {
    try {
      // Fetch movie data (doesn't require auth)
      const movieData = await getMovieById(id);
      setMovie(movieData);
      setLoading(prev => ({ ...prev, movie: false }));

      // Fetch comments (requires auth)
      try {
        const commentsData = await getCommentsByMovieId(id);
        setComments(commentsData);
      } catch (commentError) {
        if (commentError.message.includes('Authentication')) {
          navigate('/login');
          return;
        }
        console.error('Comments error:', commentError);
      }
      setLoading(prev => ({ ...prev, comments: false }));
    } catch (err) {
      setError(err.message || 'Failed to load movie data');
      setLoading({ movie: false, comments: false });
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, navigate]);

  const handleCommentAdded = (newComment) => {
    setComments(prev => [...prev, newComment]);
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (loading.movie) return <div className="spinner-border text-primary"></div>;
  if (!movie) return <div className="alert alert-warning">Movie not found</div>;

  return (
    <div className="container py-5">
      <div className="card mb-4">
        <div className="card-body">
          <h1 className="card-title display-4 mb-3">{movie.title}</h1>
          
          <div className="movie-details mb-4">
            <p className="mb-2">
              <strong>Kategorija: </strong>
              <span className="badge bg-primary">{movie.category}</span>
            </p>
            
            {movie.imdb_rating && (
              <p className="mb-2">
                <strong>IMDB: </strong>
                <span className="d-inline-flex align-items-center bg-dark bg-opacity-10 px-2 py-1 rounded">
                  <span>{movie.imdb_rating}/10</span>
                </span>
              </p>
            )}
          </div>
          
          <div className="movie-description">
            <h3 className="h5"><strong>Aprašymas</strong></h3>
            <p className="card-text">{movie.description}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="h4 mb-4">Komentarai</h2>
          <CommentSection 
            movieId={id}
            comments={comments}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      </div>
    </div>
  );
}

export default MoviePage;
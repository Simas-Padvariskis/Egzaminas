import '../styles/home/comments.css';
import { useState, useEffect } from 'react';
import { createComment, deleteComment } from '../services/CommentService';

function CommentSection({ movieId, comments = [], onCommentAdded }) {
  const [localComments, setLocalComments] = useState(comments);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep localComments in sync if parent comments prop changes
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? 'Naujasis komentaras' 
        : date.toLocaleDateString('lt-LT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
    } catch (e) {
      return 'Naujasis komentaras';
    }
  };

  const renderUserId = (userId) => {
    if (!userId) return null;
    return (
      <div className="d-flex align-items-center mt-2 User">
        <span>Vartotojas: {userId}</span>
      </div>
    );
  };

  const renderRating = (rating) => {
    if (rating === undefined || rating === null) return null;
    return (
      <div className="d-flex align-items-center mt-2 Rating">
        <span>Įvertinimas: {rating}/10</span>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const createdComment = await createComment({
        comment: newComment,
        rating: parseInt(rating, 10),
        movie_id: movieId
      });
      // Update local comments immediately
      setLocalComments(prev => [createdComment, ...prev]);
      onCommentAdded(createdComment);
      setNewComment('');
      setRating('');
    } catch (err) {
      setError('Nepavyko paskelbti komentaro: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    const confirmed = window.confirm('Ar tikrai norite ištrinti šį komentarą?');
    if (!confirmed) return;

    try {
      await deleteComment(commentId);
      // Remove deleted comment from local state
      setLocalComments(prev => prev.filter(c => c?.id !== commentId));
    } catch (err) {
      setError('Nepavyko ištrinti komentaro: ' + err.message);
    }
  };

  return (
    <div className="comment-section">
      {error && <div className="alert alert-danger">{error}</div>}

      {(!localComments || localComments.length === 0) ? (
        <p>Kol kas nėra komentarų.</p>
      ) : (
        <div className="comments-list mb-4">
          {localComments
            .filter(c => c) // filter out undefined/null
            .map(comment => (
              <div key={comment.id} className="card mb-3 Comment">
                <div className="card-body">
                  {renderUserId(comment.user_id)}
                  <strong><p className="card-text mb-2">{comment.content || comment.text || comment.comment}</p></strong>
                  {renderRating(comment.rating)}
                  <small className="text-muted">
                    {formatDate(comment.created_at || comment.createdAt || comment.date)}
                  </small>
                </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleDelete(comment.id)}
                  >
                    Ištrinti
                  </button>
              </div>
            ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 Form">
        <div className="mb-3">
          <textarea
            className="form-control"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Parašykite komentarą..."
            rows={3}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="rating" className="form-label">Įvertinimas: {rating}/10</label>
          <input
            type="range"
            className="form-range"
            id="rating"
            min="0"
            max="10"
            step="1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary SubmitComment"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Siunčiama...' : 'Paskelbti'}
        </button>
      </form>
    </div>
  );
}

export default CommentSection;
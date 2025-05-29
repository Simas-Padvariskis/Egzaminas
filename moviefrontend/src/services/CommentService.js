const API_URL = 'http://localhost:8080/api/v1';

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('jwtToken');
  if (!accessToken) {
    console.error('No JWT token found');
    throw new Error('Authentication required');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
};

const fetchRequest = async (url, options = {}, accessToken) => {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            ...options,
            headers: { ...getAuthHeaders(accessToken), ...options.headers },
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Klaida iš API:', errorData);
            throw new Error(errorData.message || 'Nenurodyta klaida');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getCommentsByMovieId = async (movieId) => {
  try {
    const response = await fetch(`${API_URL}/comments/movies/${movieId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (response.status === 401) {
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
      return []; // Return empty array instead of throwing error
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      return []; // Return empty array on API errors
    }

    const data = await response.json();
    
    // Handle different response structures:
    if (Array.isArray(data)) {
      return data; // Direct array response
    } else if (data.data && Array.isArray(data.data)) {
      return data.data; // Wrapped array response
    }
    return []; // Fallback for unexpected formats
    
  } catch (error) {
    console.error('Network error:', error);
    return []; // Return empty array on network errors
  }
};

export const createComment = async (movieData) => {
  const response = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(movieData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Nepavyko sukurti komentaro: ${errorText}`);
  }

  return await response.json();
};

// Ištrina komentarą
export const deleteComment = async (id) => {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`http://localhost:8080/api/v1/comments/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Nepavyko ištrinti komentaro');
  }
};
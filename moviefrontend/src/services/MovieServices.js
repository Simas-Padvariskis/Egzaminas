const API_URL = 'http://localhost:8080/api/v1';

const getAuthHeaders = (accessToken) => ({
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
});

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

// Gauna filmų sąrašą 
export const getMovies = async (accessToken, queryParams = {}) => {
    const { id, fields, filter } = queryParams;
    const searchParams = new URLSearchParams();

    if (id) searchParams.append('id', id);
    if (fields) searchParams.append('fields', fields);
    if (filter) searchParams.append('filter', filter);

    const url = `/movies${searchParams.toString() ? `?${searchParams}` : ''}`;

    try {
        const res = await fetchRequest(url, { method: 'GET' }, accessToken);
        console.log('Response from getMovies:', res); // Logging movie response

        if (res && res.data && Array.isArray(res.data)) {
            return res.data; 
        } else {
            console.error('Movies data is not available or malformed');
            return []; 
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
};


// Gauna filmą pagal ID
export const getMovieById = async (id, accessToken) => {
    return fetchRequest(`/movies/${id}`, { method: 'GET' }, accessToken);
};

// Sukuria naują filmą
export const createMovie = async (movieData, accessToken) => {
  const response = await fetch('http://localhost:8080/api/v1/movies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(movieData),
  });

  if (!response.ok) {
    throw new Error('Nepavyko sukurti filmo');
  }

  return await response.json();
};

// Atnaujina filmą
export async function updateMovie(id, updatedMovie, accessToken) {
  const response = await fetch(`http://localhost:8080/api/v1/movies/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`, 
    },
    body: JSON.stringify(updatedMovie),
  });

  if (!response.ok) {
    throw new Error('Failed to update movie');
  }
  return response.json();
}


// Ištrina filmą 
export const deleteMovie = async (id, accessToken) => {
    const response = await fetchRequest(`/movies/${id}`, { method: 'DELETE' }, accessToken);
    return response.movie || null;
};
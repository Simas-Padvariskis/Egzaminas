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

// Gauna kategorijų sąrašą +
export const getCategories = async (accessToken, queryParams = {}) => {
    const { id, fields, filter } = queryParams;
    const searchParams = new URLSearchParams();

    if (id) searchParams.append('id', id);
    if (fields) searchParams.append('fields', fields);
    if (filter) searchParams.append('filter', filter);

    const url = `/categories${searchParams.toString() ? `?${searchParams}` : ''}`;

    try {
        const res = await fetchRequest(url, { method: 'GET' }, accessToken);
        console.log('Response from getCategories:', res); // Loging the response of categories

        if (res && res.data && Array.isArray(res.data)) {
            return res.data; 
        } else {
            console.error('Cateogories data is not available or malformed');
            return []; 
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        return []; 
    }
};


// Gauna kategoriją pagal ID
export const getCategoryById = async (id, accessToken) => {
    try {
        const res = await fetchRequest(`/categories/${id}`, { method: 'GET' }, accessToken);
        return res?.data || null; 
    } catch (error) {
        console.error(`Error fetching category ${id}:`, error);
        return null;
    }
};

// // Sukuria naują kategoriją
export const createCategory = async (categoryData, token) => {
  const response = await fetch('http://localhost:8080/api/v1/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    throw new Error('Nepavyko sukurti categorijos');
  }

  return await response.json();
};

// Atnaujina kategoriją
export async function updateCategory(id, updatedCategory, accessToken) {
  const response = await fetch(`http://localhost:8080/api/v1/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,  
    },
    body: JSON.stringify(updatedCategory),
  });

  if (!response.ok) {
    throw new Error('Failed to update category');
  }
  return response.json();
}

// Ištrina kategoriją
export const deleteCategory = async (id, accessToken) => {
    const response = await fetchRequest(`/categories/${id}`, { method: 'DELETE' }, accessToken);
    return response.category || null;
};
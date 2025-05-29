import { createContext, useContext } from 'react';
import * as categoryServices from '../services/CategoryServices';
import { useAuth } from './AuthContext';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const { accessToken, getResponse } = useAuth();

    // Gauna kategorijų sąrašą
    const getCategories = async (queryParams = {}) => {
        try {
            const categories = await getResponse(categoryServices.getCategories(accessToken, queryParams));
            return categories.map(category => ({
                ...category,
                id: category.id,
            }));
        } catch (error) {
            console.error("Error fetching categories:", error);
            return []; // Return empty array if there's an error
        }
    };

    // Gauna kategorija pagal ID
    const getCategoryById = async (id) => {
        try {
            const response = await getResponse(categoryServices.getCategoryById(id, accessToken));
            const category = response || null; // Assuming category is returned directly or in response

            return category ? { ...category, id: category.id } : null;
        } catch (error) {
            console.error(`Error fetching category with id ${id}:`, error);
            return null; // Return null if there's an error
        }
    };

    return (
        <CategoryContext.Provider
            value={{
                getCategories,
                getCategoryById
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
};
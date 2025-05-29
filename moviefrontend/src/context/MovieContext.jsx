import { createContext, useContext } from 'react';
import * as movieServices from '../services/MovieServices';
import { useAuth } from './AuthContext';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
    const { accessToken, getResponse } = useAuth();

    // Gauna filmų sąrašą
    const getMovies = async (queryParams = {}) => {
        try {
            const movies = await getResponse(movieServices.getMovies(accessToken, queryParams));
            return movies.map(movie => ({
                ...movie,
                id: movie.id,
            }));
        } catch (error) {
            console.error("Error fetching movies:", error);
            return []; // Return empty array if there's an error
        }
    };

    // Gauna filmą pagal ID
    const getMovieById = async (id) => {
        try {
            const response = await getResponse(movieServices.getMovieById(id, accessToken));
            const movie = response || null; // Assuming movie is returned directly or in response

            return movie ? { ...movie, id: movie.id } : null;
        } catch (error) {
            console.error(`Error fetching movie with id ${id}:`, error);
            return null; // Return null if there's an error
        }
    };

    return (
        <MovieContext.Provider
            value={{
                getMovies,
                getMovieById
            }}
        >
            {children}
        </MovieContext.Provider>
    );
};

export const useMovies = () => {
    const context = useContext(MovieContext);
    if (!context) {
        throw new Error('useMovies must be used within a MovieProvider');
    }
    return context;
};
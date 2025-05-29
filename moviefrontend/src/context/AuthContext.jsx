import { createContext, useState, useContext, useEffect } from 'react';
import * as authServices from '../services/AuthServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setToken] = useState(() => localStorage.getItem('jwtToken') || null);

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('username');
        const storedRoles = localStorage.getItem('roles');
        return storedUser ? { 
            username: storedUser,
            roles: storedRoles ? JSON.parse(storedRoles) : []
        } : null;
    });

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem('jwtToken', accessToken);
        } else {
            localStorage.removeItem('jwtToken');
        }
    }, [accessToken]);

    const getResponse = async (response) => {
        const data = await response;
        if (data?.accessToken) {
            setToken(data.accessToken);
        }
        return data;
    };

    const login = async (email, password) => {
    const res = await authServices.login(email, password);
    
    if (res.accessToken) {
        localStorage.setItem('jwtToken', res.accessToken);
        localStorage.setItem('userId', res.id);
        localStorage.setItem('username', res.username);
        
        const roles = res.roles?.map(role => role.authority || role) || [];
        localStorage.setItem('roles', JSON.stringify(roles));
        
        setUser({
            username: res.username,
            roles: roles
        });
      }
        return res;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        
        const authKeys = ['jwtToken', 'username', 'roles', 'userId'];
        authKeys.forEach(key => localStorage.removeItem(key));
        
        window.location.href = '/login';
        window.location.reload();
    };


    // Naujo vartotojo kūrimas
    const createUser = async (userData) => {
        return getResponse(authServices.createUser(userData, accessToken));
    };


    return (
        <AuthContext.Provider
            value={{
                accessToken,
                setToken,
                login,
                logout,
                createUser,
                getResponse,
                user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth turi būti naudojamas su AuthProvider');
    }
    return context;
};
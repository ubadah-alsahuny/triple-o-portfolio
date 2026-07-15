import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({children}){
    const [user , setUser] = useState(null);
    const [loading , setLoading] = useState(true);
    useEffect(() => {
       

        const initAuth = async () => {
            const token = localStorage.getItem('auth_token');
       
            if (!token) { 
                setUser(null);
                setLoading(false);
                return;
            }
    
            try {
                const response = await axios.get('http://localhost:8000/api/profile/auth', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data.data);
            } catch (error) {
                localStorage.removeItem('auth_token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
    
        axios.get('http://localhost:8000/sanctum/csrf-cookie')
            .then(() => initAuth())
            .catch((err) => {
                console.error("CSRF cookie error", err);
                setLoading(false);
            });
    }, []);
    
    
    

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post('http://localhost:8000/api/register', {
                name,
                email,
                password,
                password_confirmation: password
            });
            setUser(data.user);
            return data;
        } catch (error) {
            throw error.response.data;
        }
    };


    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:8000/api/login', {
                email,
                password
            });
            setUser(data.user);
            localStorage.setItem('auth_token', data.token);
            return data;
        } catch (error) {
            throw error.response.data;
        }
    };

    const logout = async () => {
        const token = localStorage.getItem('auth_token');
        if(!token) return; 
        try {
            await axios.post('http://localhost:8000/api/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            localStorage.removeItem('auth_token');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading , setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}





export const useAuth = () => useContext(AuthContext);


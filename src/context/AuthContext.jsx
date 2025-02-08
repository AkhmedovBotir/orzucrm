import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Token mavjudligini tekshirish
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const decoded = jwtDecode(token);
          
          // Token expire bo'lganini tekshirish
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp < currentTime) {
            console.log('Token expired');
            localStorage.removeItem('token');
            setUser(null);
          } else {
            setUser(decoded);
          }
        } catch (error) {
          console.error('Token decode error:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        console.log('No token found');
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login
  const login = async (credentials) => {
    try {
      const response = await axios.post('https://backend.milliycrm.uz/api/auth/login', credentials);
      
      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        navigate('/');
      } else {
        throw new Error(response.data.message || 'Login yoki parol noto\'g\'ri');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  // Loading holatida loading component ko'rsatish
  if (loading) {
    return <div>Loading...</div>;
  }

  const contextValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

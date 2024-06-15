import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Auth/Login';
import BlogPosts from './components/Blog/BlogPosts';
import CreatePost from './components/Blog/CreatePost';
import Navbar from './components/Common/Navbar';
import { getPosts, addPost } from './indexedDB';
import HomePage from './pages/Homepage';


export const AuthContext = createContext();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    const checkAndAddInitialPost = async () => {
      const posts = await getPosts();
      if (posts.length === 0) {
        const initialPost = {
          title: 'Welcome to My Blog!',
          content: '<p>This is the first blog post. Feel free to edit or delete it.</p>',
          date: new Date(),
        };
        await addPost(initialPost);
      }
    };

    checkAndAddInitialPost();
  }, []);

  const handleLoginSuccess = (response) => {
    const token = response.credential;
    setToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
  };

  const clientId = '539365207685-7e99t5gtpk8ss1m7qq7pb1c7gjodcl8q.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContext.Provider value={{ isAuthenticated, token }}>
        <Router>
          <AppContent handleLoginSuccess={handleLoginSuccess} />
        </Router>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

const AppContent = ({ handleLoginSuccess }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login onSuccess={handleLoginSuccess} />} />
        <Route path="/" element={<ProtectedRoute component={HomePage} />} />
        <Route path="/posts" element={<ProtectedRoute component={BlogPosts} />} />
        <Route path="/create" element={<ProtectedRoute component={CreatePost} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default App;

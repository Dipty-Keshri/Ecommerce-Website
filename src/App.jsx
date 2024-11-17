import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function PrivateRoute({ children, role }) {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute role="admin">
                  <Admin />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <PrivateRoute role="user">
                  <Cart />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
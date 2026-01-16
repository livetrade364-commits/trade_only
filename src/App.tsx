import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StockDetail from './pages/StockDetail';
import Search from './pages/Search';
import MarketOverview from './pages/MarketOverview';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { checkUser, user } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/stock/:symbol"
          element={
            <PrivateRoute>
              <StockDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />
        <Route
          path="/market-overview"
          element={
            <PrivateRoute>
              <MarketOverview />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Public Routes with Redirect if Logged In */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <SignUp />}
        />
      </Routes>
    </Router>
  );
}

export default App;

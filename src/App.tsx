import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StockDetail from './pages/StockDetail';
import Search from './pages/Search';
import MarketOverview from './pages/MarketOverview';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { checkUser } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/market-overview" element={<MarketOverview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;

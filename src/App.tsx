import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import StockDetail from "@/pages/StockDetail";
import MarketOverview from "@/pages/MarketOverview";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Watchlist from "@/pages/Watchlist";
import { useAuthStore } from "@/store/useAuthStore";

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market-overview" element={<MarketOverview />} />
        <Route path="/search" element={<Search />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

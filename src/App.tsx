import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

// Lazy load pages for better performance
const Home = lazy(() => import("@/pages/Home"));
const Search = lazy(() => import("@/pages/Search"));
const StockDetail = lazy(() => import("@/pages/StockDetail"));
const MarketOverview = lazy(() => import("@/pages/MarketOverview"));
const IndianMarket = lazy(() => import("@/pages/IndianMarket"));
const Login = lazy(() => import("@/pages/Login"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Watchlist = lazy(() => import("@/pages/Watchlist"));

// Loading component
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
  </div>
);

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market-overview" element={<MarketOverview />} />
          <Route path="/indian-market" element={<IndianMarket />} />
          <Route path="/search" element={<Search />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

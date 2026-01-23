import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

// Public Route (redirects to home if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/market-overview" element={<ProtectedRoute><MarketOverview /></ProtectedRoute>} />
          <Route path="/indian-market" element={<ProtectedRoute><IndianMarket /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/stock/:symbol" element={<ProtectedRoute><StockDetail /></ProtectedRoute>} />
          <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/other" element={<ProtectedRoute><div className="text-center text-xl">Other Page - Coming Soon</div></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

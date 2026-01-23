import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { API_URL } from '../lib/utils';
import { getLogoUrl } from '../lib/logo';

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

const StockLogo = ({ symbol, name }: { symbol: string, name: string }) => {
  const [error, setError] = useState(false);
  const logoUrl = getLogoUrl(undefined, symbol);

  if (error || !logoUrl) {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gray-100 text-gray-600">
        {symbol[0]}
      </div>
    );
  }

  return (
    <img 
      src={logoUrl} 
      alt={name}
      className="w-10 h-10 rounded-full object-contain bg-white border border-gray-100 p-1"
      onError={() => setError(true)}
    />
  );
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/stock/search?q=${encodeURIComponent(q)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setResults(data);
    } catch {
      setError('Failed to fetch search results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Search Results for "{query}"
        </h1>

        {loading ? (
          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
             ))}
          </div>
        ) : error ? (
           <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
            <SearchIcon size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-100">
              {results.map((result) => (
                <Link
                  key={result.symbol}
                  to={`/stock/${result.symbol}`}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-emerald-500/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <StockLogo symbol={result.symbol} name={result.name} />
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {result.symbol}
                      </h3>
                      <p className="text-sm text-gray-500">{result.name}</p>
                    </div>
                  </div>
                  <ArrowRight className="text-gray-300 group-hover:text-emerald-600 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

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
      const response = await fetch(`http://127.0.0.1:8000/api/stock/search?q=${encodeURIComponent(q)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
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
                  className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-gray-900">{result.symbol}</span>
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-xs font-medium text-gray-600">
                        {result.exchange}
                      </span>
                    </div>
                    <div className="text-gray-500 mt-1">{result.name}</div>
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

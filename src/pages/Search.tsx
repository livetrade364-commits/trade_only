import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStockStore } from '../store/useStockStore';
import Layout from '../components/Layout';
import { Loader2 } from 'lucide-react';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const { searchResults, isLoading, searchStocks } = useStockStore();

  useEffect(() => {
    if (query) {
      searchStocks(query);
    }
  }, [query, searchStocks]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Results for "{query}"</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {searchResults.map((result) => (
                <li key={result.symbol}>
                  <Link to={`/stock/${result.symbol}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">{result.symbol}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {result.exchange}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {result.name}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>{result.type}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-10 bg-white shadow rounded-lg">
            <p className="text-gray-500">No results found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;

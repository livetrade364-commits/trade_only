import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/useAuthStore';

const Profile: React.FC = () => {
  const { user, wishlist } = useAuthStore();

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p>Please log in to view your profile.</p>
        </div>
      </Layout>
    );
  }

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                  Member Since
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{joinDate}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Account ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.id}</dd>
              </div>
            </dl>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
          My Watchlist
        </h2>

        {wishlist.length === 0 ? (
          <div className="bg-white shadow sm:rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-4">Your watchlist is empty.</p>
            <Link
              to="/market-overview"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Explore Markets
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((symbol) => (
              <Link
                key={symbol}
                to={`/stock/${symbol}`}
                className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <span className="text-white font-bold text-lg">{symbol.substring(0, 2)}</span>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">Stock Symbol</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{symbol}</div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;

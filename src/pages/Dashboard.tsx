import React, { useEffect, useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ChevronDown, 
  Brain, 
  ChevronLeft, 
  ChevronRight,
  Wallet,
  Activity,
  BarChart3,
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import Layout from '../components/Layout';
import { useMarketStore } from '../store/useMarketStore';
import SectorCard from '../components/SectorCard';

// Mock Data for Charts (Simulating the design)
const btcData = [
  { day: 'Sat', value: 5000 },
  { day: 'Sun', value: 12000 },
  { day: 'Mon', value: 25000 },
  { day: 'Tue', value: 8000 },
  { day: 'Wed', value: 16000 },
  { day: 'Thu', value: 12000 },
  { day: 'Fri', value: 22000 },
];

const volumeData = [
  { id: 1, value: 200, label: '1' },
  { id: 2, value: 350, label: '2' },
  { id: 3, value: 176, label: '3', active: true }, // Highlighted
  { id: 4, value: 400, label: '4' },
  { id: 5, value: 300, label: '5' },
  { id: 6, value: 250, label: '6' },
];

const listingsData = [
  { month: 'Apr', value: 30 },
  { month: 'May', value: 45 },
  { month: 'Jun', value: 60 },
  { month: 'Jul', value: 80 },
  { month: 'Agu', value: 50 }, // Keeping typo from design request if needed, or fixing to Aug
  { month: 'Sep', value: 70 },
  { month: 'Oct', value: 90 },
];

const Dashboard: React.FC = () => {
  const { marketOverview, topGainers, sectorPerformance, fetchMarketOverview, fetchTopGainers, fetchSectorPerformance } = useMarketStore();
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');
  const [selectedIndex, setSelectedIndex] = useState('BTC'); // For BTC Trend dropdown (mock functionality)

  useEffect(() => {
    fetchMarketOverview();
    fetchTopGainers();
    fetchSectorPerformance();
  }, [fetchMarketOverview, fetchTopGainers, fetchSectorPerformance]);

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Crypto Market Overview</h1>

        {/* Top Row: Portfolio & BTC Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Portfolio Overview Card */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
            <h3 className="text-gray-700 font-semibold mb-6">Portfolio Overview</h3>
            <div className="flex gap-6">
              <div className="flex-1 space-y-4">
                <div className="p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Coins Held</div>
                    <div className="text-lg font-bold text-gray-900">12<span className="text-gray-400 text-sm">/10</span></div>
                  </div>
                  <Wallet className="text-gray-400" size={20} />
                </div>
                <div className="p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Active Trades</div>
                    <div className="text-lg font-bold text-gray-900">1022<span className="text-gray-400 text-sm">/1300</span></div>
                  </div>
                  <Activity className="text-gray-400" size={20} />
                </div>
                <div className="p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Profit Score</div>
                    <div className="text-lg font-bold text-gray-900">112<span className="text-gray-400 text-sm">/120</span></div>
                  </div>
                  <BarChart3 className="text-gray-400" size={20} />
                </div>
              </div>
              
              {/* Market Overview Small Card */}
              <div className="w-[200px] flex flex-col space-y-2 overflow-y-auto max-h-[320px] scrollbar-hide">
                 {/* Reusing SectorCard Logic but simpler for small view */}
                 <div className="bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-2xl p-4 text-white text-center mb-2 shrink-0">
                    <div className="text-2xl font-bold mb-1">$24.500</div>
                    <div className="text-xs text-emerald-100">Total Value</div>
                 </div>
                 
                 {/* Live Market Sectors (Mini View) */}
                 <h4 className="text-xs font-semibold text-gray-500 px-1">Market Sectors</h4>
                 {sectorPerformance.slice(0, 3).map((sector) => (
                   <div key={sector.symbol} className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                     <div className="flex justify-between items-center">
                       <span className="text-xs font-medium text-gray-700 truncate max-w-[80px]">{sector.name}</span>
                       <span className={`text-xs font-bold ${sector.changesPercentage >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                         {sector.changesPercentage >= 0 ? '+' : ''}{sector.changesPercentage.toFixed(2)}%
                       </span>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* BTC Price Trend Card */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-700 font-semibold">{selectedIndex} Price Trend</h3>
              <div className="flex gap-2">
                {/* Indices Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                    {selectedIndex} <ChevronDown size={16} />
                  </button>
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg hidden group-hover:block z-10">
                    {['BTC', 'ETH', 'SPX', 'NDX', 'DJI'].map((idx) => (
                      <button 
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {idx}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  {selectedPeriod} <ChevronDown size={16} />
                </button>
              </div>
            </div>
            
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={btcData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                    tickFormatter={(value) => `${value/1000}k`}
                  />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Middle Row: AI Analysis & Global Cap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* AI Market Analysis */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <Brain size={18} className="text-emerald-600" />
                </div>
                <h3 className="text-gray-700 font-semibold">AI Market Analysis</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                  AI Confidence: 92% Bullish
                </span>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-50 rounded text-gray-400"><ChevronLeft size={20} /></button>
                  <button className="p-1 hover:bg-gray-50 rounded text-gray-400"><ChevronRight size={20} /></button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Top Gainers as small cards */}
              {topGainers.slice(0, 3).map((stock, index) => {
                const logoUrl = getLogoUrl(stock.website, stock.symbol);
                return (
                <div key={stock.symbol} className="p-4 border border-gray-100 rounded-xl flex items-center justify-between hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0">
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt={stock.symbol} 
                          className="w-10 h-10 rounded-full object-contain bg-white border border-gray-100 p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                        logoUrl ? 'hidden' : ''
                      } ${index === 0 ? 'bg-orange-500' : index === 1 ? 'bg-blue-500' : 'bg-purple-500'}`}>
                        {stock.symbol[0]}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                        {stock.symbol} Trend 
                        <span className={stock.changePercent >= 0 ? "text-emerald-500" : "text-red-500"}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Market is {stock.changePercent > 0 ? 'Bullish' : 'Bearish'}
                      </div>
                    </div>
                  </div>
                  <TrendingUp size={16} className={stock.changePercent >= 0 ? "text-emerald-500" : "text-red-500"} />
                </div>
                );
              })}
            </div>
          </div>

          {/* Global Market Cap */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Global market cap</h3>
            <div className="text-2xl font-bold text-gray-900 mb-6">$3,741,074,288,163</div>
            
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-gray-600">Trading bias <span className="text-emerald-500">80.4% Buying</span></span>
              <span className="text-emerald-500">19.6% 24H</span>
            </div>
            <div className="h-2 w-full bg-red-400 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500 w-[80.4%]"></div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Volume, New Listings, Sentiment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Trading Volume */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 relative overflow-hidden">
            <h3 className="text-gray-900 font-semibold mb-1">Trading Volume</h3>
            <div className="text-xs text-gray-500 mb-6">Total emission this month</div>
            
            <div className="flex items-end gap-2 mb-6">
              <div className="text-2xl font-bold text-gray-900">$1,124,000</div>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded flex items-center mb-1">
                18% <ArrowUp size={10} className="ml-0.5" />
              </span>
            </div>

            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={volumeData}>
                   <defs>
                     <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Area 
                     type="monotone" 
                     dataKey="value" 
                     stroke="#10B981" 
                     fill="url(#colorVol)" 
                     strokeWidth={2}
                   />
                   {/* Custom Marker simulating the $176 tag */}
                   <Tooltip 
                     content={({ active, payload }) => {
                       if (active && payload && payload.length) {
                         return (
                           <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                             ${payload[0].value}
                           </div>
                         );
                       }
                       return null;
                     }}
                   />
                 </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Listings */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
            <h3 className="text-gray-900 font-semibold mb-4">New Listings</h3>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-gray-900">5 New Tokens</span>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">+3</span>
            </div>
            <div className="text-xs text-gray-500 mb-6">+35% growth in new listings this month</div>

            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={listingsData}>
                  <Bar dataKey="value" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Sentiment */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 flex flex-col justify-between">
            <div>
              <h3 className="text-gray-900 font-semibold mb-1">Market Sentiment</h3>
              <div className="text-xs text-gray-500 mb-6">The market is currently <span className="text-emerald-500 font-bold">Bullish</span></div>
            </div>

            <div className="flex items-center gap-4 my-4">
               {/* Custom Bar Gauge Simulation */}
               <div className="flex-1 h-12 flex gap-1">
                 {Array.from({ length: 20 }).map((_, i) => (
                   <div 
                     key={i} 
                     className={`w-1.5 rounded-sm ${i < 16 ? 'bg-emerald-500' : 'bg-gray-200'}`}
                     style={{ height: `${30 + Math.random() * 70}%`, alignSelf: 'center' }}
                   ></div>
                 ))}
               </div>
               <div className="text-4xl font-bold text-white relative">
                 <span className="absolute inset-0 text-emerald-500 blur-sm opacity-50">80%</span>
                 <span className="relative text-emerald-500">80%</span>
               </div>
            </div>

            <div className="text-[10px] text-gray-400 mt-4 space-y-1">
              <div>Based on latest AI market data</div>
              <div>Last updated: Oct 2025</div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

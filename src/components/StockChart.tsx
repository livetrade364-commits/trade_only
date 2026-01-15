import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { StockHistory } from '../types';

interface StockChartProps {
  data: StockHistory;
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const chartData = data.data.map((item) => ({
    ...item,
    dateStr: new Date(item.date).toLocaleDateString(),
  }));

  return (
    <div className="h-[400px] w-full bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Price History ({data.period})</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="dateStr" 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            minTickGap={30}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#2563eb"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;

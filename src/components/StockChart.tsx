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

interface StockChartProps {
  data: {
    date: string;
    close: number;
  }[];
  currency?: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, currency = 'USD' }) => {
  const isPositive = data.length > 0 && data[data.length - 1].close >= data[0].close;
  const color = isPositive ? '#10B981' : '#EF4444'; // emerald-500 or red-500

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="date" 
            hide 
            // axisLine={false} 
            // tickLine={false}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right" 
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatPrice}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '12px', 
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: '#1F2937', fontWeight: 600 }}
            formatter={(value: number) => [formatPrice(value), 'Price']}
            labelStyle={{ color: '#6B7280', marginBottom: '0.25rem' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Area 
            type="monotone" 
            dataKey="close" 
            stroke={color} 
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

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { axiosInstance } from '@/lib/api';
import Skeleton from './Loader';

type ThorchainInterval = {
  timestamp: string; // Unix timestamp
  btc_amount: number;
  btc_address: string;
};

type RangeStats = {
  range: string;
  transactionCount: number;
  totalVolume: number;
  averageTxSize: number;
  uniqueAddresses: number;
};

type MonthData = {
  month: string;
  stats: RangeStats[];
};

const ThorchainAnalytics = () => {
  const [swaps, setSwaps] = useState<ThorchainInterval[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState<MonthData[]>([]);

  const fetchThorchainData = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get<ThorchainInterval[]>('/thorchain');
      setSwaps(data);
      analyzeData(data);
    } catch (err) {
      console.error('Error fetching Thorchain Data', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeData = (data: ThorchainInterval[]) => {
    const ranges = [
      { min: 0, max: 0.05, label: '0 - 0.05' },
      { min: 0.05, max: 0.15, label: '0.05 - 0.15' },
      { min: 0.15, max: 1, label: '0.15 - 1' },
      { min: 1, max: 10, label: '1 - 10' },
      { min: 10, max: Infinity, label: '10+' },
    ];
  
    // Group data by month
    const groupedByMonth = data.reduce((acc, swap) => {
      const date = new Date(Number(swap.timestamp) * 1000); // Convert timestamp to milliseconds
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(swap);
      return acc;
    }, {} as Record<string, ThorchainInterval[]>);
  
    // Analyze stats for each month
    const monthlyStats = Object.entries(groupedByMonth).map(([month, swaps]) => {
      const stats = ranges.map(({ min, max, label }) => {
        const filtered = swaps.filter((swap) => swap.btc_amount >= min && swap.btc_amount < max);
  
        const uniqueAddresses = new Set(filtered.map((swap) => swap.btc_address));
  
        const totalVolume = filtered.reduce((sum, swap) => sum + swap.btc_amount, 0);
        const transactionCount = filtered.length;
        const averageTxSize = transactionCount > 0 ? totalVolume / transactionCount : 0;
  
        return {
          range: label,
          transactionCount,
          totalVolume,
          averageTxSize,
          uniqueAddresses: uniqueAddresses.size,
        };
      });
  
      return { month, stats };
    });
  
    setMonthlyStats(monthlyStats);
  };

  useEffect(() => {
    fetchThorchainData();
  }, []);

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <Card>
      <CardContent className="p-4">
        {monthlyStats.length > 0 ? (
          monthlyStats.map((monthData) => (
            <div key={monthData.month} className="mb-6">
              <h3 className="text-lg font-bold text-center">{monthData.month}</h3>
              <table className="table-auto w-full text-left mt-2">
                <thead>
                  <tr>
                    <th>BTC Range</th>
                    <th className='text-center'>Transaction Count</th>
                    <th className='text-center'>Unique Addresses</th>
                    <th className='text-center'>Total Volume</th>
                    <th className='text-center'>Average Tx Size</th>
                  </tr>
                </thead>
                <tbody>
                  {monthData.stats.map((stat) => (
                    <tr key={stat.range}>
                      <td>{stat.range}</td>
                      <td className='text-center'>{stat.transactionCount}</td>
                      <td className='text-center'>{stat.uniqueAddresses}</td>
                      <td className='text-center'>{stat.totalVolume.toFixed(0)} BTC</td>
                      <td className='text-center'>{stat.averageTxSize.toFixed(6)} BTC</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ThorchainAnalytics;

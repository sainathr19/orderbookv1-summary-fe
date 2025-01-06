import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { axiosInstance } from '@/lib/api';
import Skeleton from './Loader';
import { formatAmount } from '@/lib/utils'; // Assumes formatAmount handles decimal conversion

type ChainflipInterval = {
  timestamp: string; // Unix timestamp
  btc_amount: string; // Amount in satoshis (lowest denomination)
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

const ChainflipAnalytics = () => {
  const [swaps, setSwaps] = useState<ChainflipInterval[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState<MonthData[]>([]);

  const fetchChainflipData = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get<ChainflipInterval[]>('/chainflip');
      setSwaps(data);
      analyzeData(data);
    } catch (err) {
      console.error('Error fetching Chainflip Data', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeData = (data: ChainflipInterval[]) => {
    const ranges = [
      { min: 0, max: 0.05, label: '0 - 0.05 BTC' },
      { min: 0.05, max: 0.15, label: '0.05 - 0.15 BTC' },
      { min: 0.15, max: 1, label: '0.15 - 1 BTC' },
      { min: 1, max: 10, label: '1 - 10 BTC' },
      { min: 10, max: Infinity, label: '10+ BTC' },
    ];

    // Group data by month
    const groupedByMonth = data.reduce((acc, swap) => {
      const date = new Date(Number(swap.timestamp) * 1000); // Convert timestamp to milliseconds
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(swap);
      return acc;
    }, {} as Record<string, ChainflipInterval[]>);

    // Analyze stats for each month
    const monthlyStats = Object.entries(groupedByMonth).map(([month, swaps]) => {
      const stats = ranges.map(({ min, max, label }) => {
        const filtered = swaps.filter((swap) => {
          const btcAmount = formatAmount(swap.btc_amount, 8); // Convert to BTC
          return btcAmount >= min && btcAmount < max;
        });

        const uniqueAddresses = new Set(filtered.map((swap) => swap.btc_address));

        const totalVolume = filtered.reduce(
          (sum, swap) => sum + formatAmount(swap.btc_amount, 8),
          0
        );
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
    fetchChainflipData();
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
              <table className="table-auto w-full text-left mt-4 border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">BTC Range</th>
                    <th className="px-4 py-2 text-center">Transaction Count</th>
                    <th className="px-4 py-2 text-center">Unique Addresses</th>
                    <th className="px-4 py-2 text-center">Total Volume</th>
                    <th className="px-4 py-2 text-center">Average Tx Size</th>
                  </tr>
                </thead>
                <tbody>
                  {monthData.stats.map((stat) => (
                    <tr key={stat.range} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-4 py-2">{stat.range}</td>
                      <td className="px-4 py-2 text-center">{stat.transactionCount}</td>
                      <td className="px-4 py-2 text-center">{stat.uniqueAddresses}</td>
                      <td className="px-4 py-2 text-center">{stat.totalVolume.toFixed(0)} BTC</td>
                      <td className="px-4 py-2 text-center">{stat.averageTxSize.toFixed(6)} BTC</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ChainflipAnalytics;

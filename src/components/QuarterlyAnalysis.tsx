import { MatchedOrder } from '@/lib/types';
import { calculateAmount, formatAmount } from '@/lib/utils';
import { format, subMonths } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import Skeleton from './Loader';
import { axiosInstance } from '@/lib/api';

const formatUsdMillions = (amount: number) => {
    return `${(amount / 1_000_000).toFixed(2)} M`;
};

const calculatePercentage = (part: number, total: number) => {
    if (total <= 0) return '0.00';
    return ((part / total) * 100).toFixed(2);
};

const QuarterlyAnalysis = () => {
    const [monthlyData, setMonthlyData] = useState<{
        month: string;
        totalBtc: number;
        taggedBtc: number;
        untaggedBtc: number;
        volumeUsd: number;
        taggedVolumeUsd: number;
        untaggedVolumeUsd: number;
    }[]>([]);

    const [quarterlyTotal, setQuarterlyTotal] = useState<{
        totalBtc: number;
        taggedBtc: number;
        untaggedBtc: number;
        volumeUsd: number;
        taggedVolumeUsd: number;
        untaggedVolumeUsd: number;
    }>({
        totalBtc: 0,
        taggedBtc: 0,
        untaggedBtc: 0,
        volumeUsd: 0,
        taggedVolumeUsd: 0,
        untaggedVolumeUsd: 0
    });

    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState<MatchedOrder[]>([]);

    const fetchLastThreeMonthsData = async () => {
        setIsLoading(true);
        const today = new Date();
        const currentYear = today.getFullYear();
        const quarterStart = today.getMonth() < 9 
            ? new Date(currentYear - 1, 9, 1)
            : new Date(currentYear, 9, 1);
        
        try {
            const { data } = await axiosInstance.get<MatchedOrder[]>(
                `/orders?from=${quarterStart.getTime()}&to=${today.getTime()}`
            );
            setOrders(data);
        } catch (err) {
            console.error("Error fetching orders: ", err);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateMonthlyAnalysis = (orders: MatchedOrder[]) => {
        const months: Record<string, {
            month: string;
            totalBtc: number;
            taggedBtc: number;
            untaggedBtc: number;
            volumeUsd: number;
            taggedVolumeUsd: number;
            untaggedVolumeUsd: number;
        }> = {};

        orders.forEach((order) => {
            const monthKey = format(new Date(order.CreatedAt), "yyyy-MM");
            const btcAmount = formatAmount(order.initiatorAtomicSwap.amount, 8);
            
            const usdAmount = calculateAmount(order.initiatorAtomicSwap.priceByOracle,order.initiatorAtomicSwap.amount,8) 
                                + 
                              calculateAmount(order.followerAtomicSwap.priceByOracle,order.followerAtomicSwap.amount,8);
            
            if (!months[monthKey]) {
                months[monthKey] = {
                    month: monthKey,
                    totalBtc: 0,
                    taggedBtc: 0,
                    untaggedBtc: 0,
                    volumeUsd: 0,
                    taggedVolumeUsd: 0,
                    untaggedVolumeUsd: 0
                };
            }

            const isTagged = order.tags && order.tags?.length > 0;
            const monthData = months[monthKey];

            monthData.totalBtc += btcAmount;
            monthData.volumeUsd += usdAmount;

            if (isTagged) {
                monthData.taggedBtc += btcAmount;
                monthData.taggedVolumeUsd += usdAmount;
            } else {
                monthData.untaggedBtc += btcAmount;
                monthData.untaggedVolumeUsd += usdAmount;
            }
        });

        const lastThreeMonths = Array.from({ length: 3 }, (_, i) => {
            const date = subMonths(new Date(), i);
            const monthKey = format(date, "yyyy-MM");
            return months[monthKey] || {
                month: monthKey,
                totalBtc: 0,
                taggedBtc: 0,
                untaggedBtc: 0,
                volumeUsd: 0,
                taggedVolumeUsd: 0,
                untaggedVolumeUsd: 0
            };
        }).reverse();

        const quarterTotal = lastThreeMonths.reduce((acc, month) => ({
            totalBtc: acc.totalBtc + month.totalBtc,
            taggedBtc: acc.taggedBtc + month.taggedBtc,
            untaggedBtc: acc.untaggedBtc + month.untaggedBtc,
            volumeUsd: acc.volumeUsd + month.volumeUsd,
            taggedVolumeUsd: acc.taggedVolumeUsd + month.taggedVolumeUsd,
            untaggedVolumeUsd: acc.untaggedVolumeUsd + month.untaggedVolumeUsd
        }), {
            totalBtc: 0,
            taggedBtc: 0,
            untaggedBtc: 0,
            volumeUsd: 0,
            taggedVolumeUsd: 0,
            untaggedVolumeUsd: 0
        });

        setMonthlyData(lastThreeMonths);
        setQuarterlyTotal(quarterTotal);
    };

    useEffect(() => {
        fetchLastThreeMonthsData();
    }, []);

    useEffect(() => {
        if (orders.length > 0) {
            calculateMonthlyAnalysis(orders);
        }
    }, [orders]);

    if (isLoading) return <Skeleton />;

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardDescription className="text-center">
                    Breakdown of transactions from October 2024
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded">
                    <div className="text-center">
                        <p className="font-semibold">Quarterly Total BTC</p>
                        <p>{quarterlyTotal.totalBtc.toFixed(2)} ({formatUsdMillions(quarterlyTotal.volumeUsd)})</p>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold">Tagged Contribution</p>
                        <p>{quarterlyTotal.taggedBtc.toFixed(2)} ({formatUsdMillions(quarterlyTotal.taggedVolumeUsd)})</p>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold">Tagged Volume USD</p>
                        <p>{formatUsdMillions(quarterlyTotal.taggedVolumeUsd)}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold">Untagged Volume USD</p>
                        <p>{formatUsdMillions(quarterlyTotal.untaggedVolumeUsd)}</p>
                    </div>
                </div>

                {monthlyData.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Month</TableHead>
                                <TableHead className="text-center">Total BTC (USD)</TableHead>
                                <TableHead className="text-center">Tagged BTC (USD)</TableHead>
                                <TableHead className="text-center">Untagged BTC (USD)</TableHead>
                                <TableHead className="text-center">Tagged %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {monthlyData.map((data) => (
                                <TableRow key={data.month}>
                                    <TableCell className="text-center">{data.month}</TableCell>
                                    <TableCell className="text-center">
                                        {data.totalBtc.toFixed(2)} ({formatUsdMillions(data.volumeUsd)})
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {data.taggedBtc.toFixed(2)} ({formatUsdMillions(data.taggedVolumeUsd)})
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {data.untaggedBtc.toFixed(2)} ({formatUsdMillions(data.untaggedVolumeUsd)})
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {calculatePercentage(data.taggedVolumeUsd, data.volumeUsd)}%
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        No data available for the last 3 months
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default QuarterlyAnalysis;
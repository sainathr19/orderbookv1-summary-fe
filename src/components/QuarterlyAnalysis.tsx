import { MatchedOrder } from '@/lib/types';
import { calculateAmount, formatAmount } from '@/lib/utils';
import { format, subMonths } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import Skeleton from './Loader';
import { axiosInstance } from '@/lib/api';

const QuarterlyAnalysis = () => {
    const [monthlyData, setMonthlyData] = useState<{
        month: string;
        totalBtc: number;
        taggedBtc: number;
        untaggedBtc: number;
        taggedVolume: number;
        untaggedVolume: number;
    }[]>([]);
    
    const [quarterlyTotal, setQuarterlyTotal] = useState<{
        totalBtc: number;
        taggedBtc: number;
        untaggedBtc: number;
        taggedVolume: number;
        untaggedVolume: number;
    }>({
        totalBtc: 0,
        taggedBtc: 0,
        untaggedBtc: 0,
        taggedVolume: 0,
        untaggedVolume: 0
    });

    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState<MatchedOrder[]>([]);

    const fetchLastThreeMonthsData = async () => {
        setIsLoading(true);
        const today = new Date();

        // October's start
        const currentYear = today.getFullYear();
        const quarterStart = today.getMonth() < 9 
            ? new Date(currentYear - 1, 9, 1)
            : new Date(currentYear, 9, 1);
        
        const fromEpoch = quarterStart.getTime();
        const toEpoch = today.getTime();

        try {
            const { data } = await axiosInstance.get<MatchedOrder[]>(`/orders?from=${fromEpoch}&to=${toEpoch}`);
            console.log("Fetched Orders:", data);
            setOrders(data);
        } catch (err) {
            console.error("Error fetching orders: ", err);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateMonthlyAnalysis = (orders: MatchedOrder[]) => {

        const months: { [key: string]: {
            month: string;
            totalBtc: number;
            taggedBtc: number;
            untaggedBtc: number;
            taggedVolume: number;
            untaggedVolume: number;
        }} = {};

        // Process orders
        orders.forEach((order) => {
            const orderDate = new Date(order.CreatedAt);
            const monthKey = format(orderDate, "yyyy-MM");
            const orderAmount = formatAmount(order.initiatorAtomicSwap.amount, 8);
            const calculatedAmount = calculateAmount(
                order.initiatorAtomicSwap.priceByOracle,
                order.initiatorAtomicSwap.amount,
                8
            );
            const orderVolume = calculatedAmount / 1_000_000; 

            if (!months[monthKey]) {
                months[monthKey] = {
                    month: monthKey,
                    totalBtc: 0,
                    taggedBtc: 0,
                    untaggedBtc: 0,
                    taggedVolume: 0,
                    untaggedVolume: 0
                };
            }

            const isTagged = order.tags && order.tags.length > 0;

            months[monthKey].totalBtc += orderAmount;
            if (isTagged) {
                months[monthKey].taggedBtc += orderAmount;
                months[monthKey].taggedVolume += orderVolume;
            } else {
                months[monthKey].untaggedBtc += orderAmount;
                months[monthKey].untaggedVolume += orderVolume;
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
                taggedVolume: 0,
                untaggedVolume: 0
            };
        }).reverse();

        const quarterTotal = lastThreeMonths.reduce((acc, month) => ({
            totalBtc: acc.totalBtc + month.totalBtc,
            taggedBtc: acc.taggedBtc + month.taggedBtc,
            untaggedBtc: acc.untaggedBtc + month.untaggedBtc,
            taggedVolume: acc.taggedVolume + month.taggedVolume,
            untaggedVolume: acc.untaggedVolume + month.untaggedVolume
        }), {
            totalBtc: 0,
            taggedBtc: 0,
            untaggedBtc: 0,
            taggedVolume: 0,
            untaggedVolume: 0
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

    if (isLoading) {
        return (
                <Skeleton/>
        );
    }

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardDescription className='text-center'>
                    Breakdown of transactions for the last 3 months
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Quarterly Summary */}
                <div className="mb-4 grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded">
                    <div className='text-center'>
                        <p className="font-semibold">Quarterly Total BTC</p>
                        <p>{quarterlyTotal.totalBtc.toFixed(2)}</p>
                    </div>
                    <div className='text-center'>
                        <p className="font-semibold">Tagged Contribution</p>
                        <p>{`${quarterlyTotal.taggedBtc.toFixed(2)} (${quarterlyTotal.taggedVolume + quarterlyTotal.untaggedVolume > 0 
                                ? ((quarterlyTotal.taggedVolume / (quarterlyTotal.taggedVolume + quarterlyTotal.untaggedVolume)) * 100).toFixed(2) 
                                : '0.00'})`}</p>
                    </div>
                    <div className='text-center'>
                        <p className="font-semibold">Tagged Volume (millions)</p>
                        <p>
                            {`${quarterlyTotal.taggedVolume.toFixed(2)}`}
                        </p>
                    </div>
                    <div className='text-center'>
                        <p className="font-semibold">Untagged Volume (millions)</p>
                        <p>{quarterlyTotal.untaggedVolume.toFixed(2)}</p>
                    </div>
                </div>

                {/* Monthly Breakdown Table */}
                {monthlyData.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Month</TableHead>
                                <TableHead className="text-center">Total BTC</TableHead>
                                <TableHead className="text-center">Tagged BTC</TableHead>
                                <TableHead className="text-center">Untagged BTC</TableHead>
                                <TableHead className="text-center">Contribution</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {monthlyData.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">{data.month}</TableCell>
                                    <TableCell className="text-center">{data.totalBtc.toFixed(2)}</TableCell>
                                    <TableCell className="text-center">{data.taggedBtc.toFixed(2)}</TableCell>
                                    <TableCell className="text-center">{data.untaggedBtc.toFixed(2)}</TableCell>
                                    <TableCell className="text-center">
                                        {data.taggedVolume > 0 ? (((data.taggedVolume / (data.taggedVolume + data.untaggedVolume)) * 100).toFixed(2)) : '0.00'}
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
    )
}

export default QuarterlyAnalysis;
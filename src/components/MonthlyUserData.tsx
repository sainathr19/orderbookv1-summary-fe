import { MatchedOrder } from '@/lib/types';
import { formatAmount } from '@/lib/utils';
import { format, startOfMonth } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

type Props = {
    orders: MatchedOrder[];
};

const MonthlyUserData = ({ orders }: Props) => {
    const [monthlyData, setMonthlyData] = useState<{ month: string; btcAmount: number; percentageChange: number | null }[]>([]);

    const calculateMonthlyData = (orders: MatchedOrder[]) => {
        const today = new Date();
        const currentYear = today.getFullYear();

        // October start
        const startMonth = today.getMonth() < 9 ? new Date(currentYear - 1, 9, 1) : new Date(currentYear, 9, 1);

        const months: { [key: string]: number } = {};

        orders.forEach((order) => {
            const orderDate = new Date(order.CreatedAt);
            if (orderDate >= startMonth && orderDate <= today) {
                const monthKey = format(orderDate, 'yyyy-MM');
                months[monthKey] = (months[monthKey] || 0) + formatAmount(order.initiatorAtomicSwap.amount, 8);
            }
        });

        const monthlyKeys: string[] = [];
        const currentDate = startOfMonth(startMonth);

        while (currentDate <= today) {
            const monthKey = format(currentDate, 'yyyy-MM');
            monthlyKeys.push(monthKey);
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        const monthlyDataWithChange = monthlyKeys.map((monthKey, index, arr) => {
            const btcAmount = months[monthKey] || 0;
            if (index === 0) return { month: monthKey, btcAmount, percentageChange: null };

            const prevMonthKey = arr[index - 1];
            const prevBtcAmount = months[prevMonthKey] || 0;
            const change = prevBtcAmount ? ((btcAmount - prevBtcAmount) / prevBtcAmount) * 100 : null;

            return { month: monthKey, btcAmount, percentageChange: change };
        });

        setMonthlyData(monthlyDataWithChange);
    };

    useEffect(() => {
        calculateMonthlyData(orders);
    }, [orders]);

    return (
        <>
            {monthlyData && (
                <Card className="mb-4 outline-none shadow-none rounded-none border-none">
                    <CardHeader>
                        <CardDescription className="text-center">From October to Date</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">Month</TableHead>
                                    <TableHead className="text-center">BTC Amount</TableHead>
                                    <TableHead className="text-center">% Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {monthlyData.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-center">{data.month}</TableCell>
                                        <TableCell className="text-center">{data.btcAmount.toFixed(2)}</TableCell>
                                        <TableCell className="text-center">
                                            {data.percentageChange !== null
                                                ? `${data.percentageChange.toFixed(2)}%`
                                                : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default MonthlyUserData;

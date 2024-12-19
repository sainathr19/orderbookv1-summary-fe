import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { MatchedOrder } from "@/lib/types";
import { calculateAmount } from "@/lib/utils";
import Skeleton from "./Loader";

type Props = {
  orders: MatchedOrder[];
  isLoading : boolean
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#F39C12"];

const Overview = ({ orders ,isLoading}: Props) => {
  const tagAmountData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const tagAmounts: Record<string, number> = { untagged: 0 };

    orders.forEach((order) => {
      const orderAmount = calculateAmount(
        order.initiatorAtomicSwap.priceByOracle, 
        order.initiatorAtomicSwap.amount, 
        8
      );

      if (order.tags && order.tags.length > 0) {
        order.tags.forEach((tag) => {
          tagAmounts[tag] = (tagAmounts[tag] || 0) + orderAmount;
        });
      } else {
        tagAmounts["untagged"] += orderAmount;
      }
    });

    const totalAmount = Object.values(tagAmounts).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(tagAmounts)
      .filter(([_, amount]) => amount > 0)
      .map(([tag, amount]) => ({
        name: tag,
        value: (amount / totalAmount) * 100,
        fullAmount: amount.toFixed(4)
      }))
      .sort((a, b) => b.value - a.value);
  }, [orders]);

  if(isLoading){
    return <Skeleton/>
  }

  if (tagAmountData.length === 0) {
    return <div>No data available to display.</div>;
  }


  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <PieChart width={800} height={400}>
        <Pie
          data={tagAmountData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label={(entry) => `${entry.name} (${entry.value.toFixed(2)}%)`}
        >
          {tagAmountData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {/* <Tooltip 
          formatter={(value, name, props) => {
            const fullAmount = props.payload.fullAmount;
            return [`${Number(value).toFixed(2)}%`, `${fullAmount} BTC`];
          }}
        /> */}
        <Legend />
      </PieChart>
    </div>
  );
};

export default Overview;
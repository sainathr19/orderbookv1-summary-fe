"use client";
import DatePicker from "@/components/DatePicker";
import TransactionsTable from "@/components/TransactionsTable";
import Skeleton from "@/components/Loader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MatchedOrder } from "@/lib/types";
import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "@/components/Overview";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import QuarterlyAnalysis from "@/components/QuarterlyAnalysis";
import { axiosInstance } from "@/lib/api";
import ThorchainAnalytics from "@/components/Thorchain";

export default function Home() {
  const [orders, setOrders] = useState<MatchedOrder[] | undefined>();
  const [isLoading, setLoading] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({from: addDays(new Date(), -7),to: new Date()});
  const [selectedTag, setSelectedTag] = useState<string>(""); 
  const [tags, setTags] = useState<string[]>([]); 

  const FetchOrders = async () => {
    setLoading(true);
    const fromEpoch = date?.from?.getTime();
    const toEpoch = date?.to?.getTime();
    try {
      const { data } = await axiosInstance.get<MatchedOrder[]>(`/orders?from=${fromEpoch}&to=${toEpoch}`);
      data.reverse();
      setOrders(data);
      const uniqueTags = Array.from(new Set(data.flatMap(order => order.tags || [])));
      setTags(uniqueTags);
    } catch (err) {
      console.log("Error fetching Orders: ", err);
    } finally {
      setLoading(false);
    }
  };

  const addTagToUser = (makerAddress: string, tag: string) => {
    if (!orders) return;
    const updatedOrders = orders.map(order => {
      if (order.maker === makerAddress) {
        return {
          ...order,
          tags: order.tags ? [...order.tags, tag] : [tag],
        };
      }
      return order;
    });
    setOrders(updatedOrders);
  };

  useEffect(() => {
    FetchOrders();
  }, []);

  const filteredOrders = selectedTag
    ? orders?.filter(order => order.tags?.includes(selectedTag))
    : orders;

  return (
    <Card className="outline-none border-none shadow-none">
      <CardHeader className="flex flex-col gap-5 items-center justify-center">
        <div className="flex gap-5">
          <DatePicker date={date} setDate={setDate} />
          <Button variant="secondary" onClick={() => FetchOrders()}>Filter</Button>
        </div>
        <div className="flex items-center gap-5">
        {tags.length > 0 && (
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="p-2 bg-slate-100 rounded-md text-base px-3"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        )}
        <Link href='/search' className="p-2 rounded-md bg-slate-100 flex gap-1 items-center text-base">Search address <MoveUpRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quarter">Quaterly Data</TabsTrigger>
            <TabsTrigger value="thorchain">Thorchain</TabsTrigger>
            <TabsTrigger value="chainflip">ChainFlip</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            {isLoading ? (
              <Skeleton />
            ) : (
              filteredOrders && <TransactionsTable orders={filteredOrders} addTagToUser={addTagToUser} />
            )}
          </TabsContent>
          <TabsContent value="overview">
            {orders && <Overview orders={orders}  isLoading={isLoading}/>}
          </TabsContent>

          <TabsContent value="quarter">
            <QuarterlyAnalysis/>
          </TabsContent>
          <TabsContent value="thorchain">
            <ThorchainAnalytics/>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

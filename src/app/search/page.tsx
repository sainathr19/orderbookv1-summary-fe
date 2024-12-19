"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { MatchedOrder } from "@/lib/types";
import { calculateAmount, formatAmount, formatDate } from "@/lib/utils";
import MonthlyUserData from "@/components/MonthlyUserData";
import { AddTag } from "@/components/AddTag";
import { axiosInstance } from "@/lib/api";

const searchAddresses = async (query: string) => {
  const { data } = await axiosInstance.get(`/search?address=${query}`);
  return data;
};

interface SearchResponse{
  tags : string[],
  orders : MatchedOrder[]
}

export default function AddressSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResponse>();
  const [isLoading, setIsLoading] = useState(false);

  const summaryData = searchResults
    ? searchResults.orders.reduce(
        (acc, order) => {
          const amount = calculateAmount(order.initiatorAtomicSwap.priceByOracle,order.initiatorAtomicSwap.amount,8);
          const formattedAmount = formatAmount(order.initiatorAtomicSwap.amount,8);
          acc.totalAmount += amount;
          acc.highestOrder = Math.max(acc.highestOrder, formattedAmount);
          acc.total_btc += formatAmount(order.initiatorAtomicSwap.amount,8);
          return acc;
        },
        { totalAmount: 0, highestOrder: 0, transactions: searchResults.orders.length , total_btc : 0 }
      )
    : null;


  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await searchAddresses(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = (address: string, tag: string) => {
    setSearchResults((prev) => {
      return {
        tags: prev?.tags ? [...prev.tags, tag] : [tag],
        orders : prev?.orders || []
      };
    });
  };

  return (
      <Card className="border-none outline-none shadow-none">
        <CardHeader>
          <Card>
            <CardContent className="mt-3 flex flex-row gap-2">
              <Input
                type="text"
                placeholder="Enter address to search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </CardContent>
          </Card>
        </CardHeader>

      {summaryData && (
        <Card className="mb-4 outline-none shadow-none rounded-none border-none">
        <CardHeader>
          <CardDescription className="text-center">User Summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="font-semibold">Total Transactions:</p>
              <p>{summaryData.transactions}</p>
            </div>
            <div>
              <p className="font-semibold">Total BTC:</p>
              <p>{summaryData.total_btc}</p>
            </div>
            <div>
              <p className="font-semibold">Average Order Value:</p>
              <p>{summaryData.transactions > 0 ? (summaryData.total_btc / summaryData.transactions).toFixed(2) : "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Highest BTC:</p>
              <p>{summaryData.highestOrder.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Total Amount Transacted:</p>
              <p>{summaryData.totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">User Tags:</p>
              <p>{searchResults && searchResults.tags.length > 0 ? searchResults.tags.join(", ") : "None"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <AddTag address={searchQuery} addTagToUser={handleAddTag}/>
        </CardFooter>
      </Card>
    )}


      <CardContent>
        {searchResults && <MonthlyUserData orders={searchResults?.orders}/>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Init Chain</TableHead>
              <TableHead className="text-center">Redeem Chain</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">USD Amount</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableCaption>Loading...</TableCaption>
          ) : !searchResults ? (
            <TableCaption>No orders found. Try a different search.</TableCaption>
          ) : (
            <TableBody>
              {searchResults.orders.map((order, index) => {
                const {initiatorAtomicSwap } = order;
                const amount = calculateAmount(initiatorAtomicSwap.priceByOracle,initiatorAtomicSwap.amount,8);
                 return <TableRow key={index}>
                  <TableCell className="text-center">{formatDate(order.CreatedAt) || "N/A"}</TableCell>
                  <TableCell className="text-center">{initiatorAtomicSwap.chain || "N/A"}</TableCell>
                  <TableCell className="text-center">{order.followerAtomicSwap.chain || "N/A"}</TableCell>
                  <TableCell className="text-center">{`${formatAmount(initiatorAtomicSwap.amount,8).toFixed(2)}` || "NA"}</TableCell>
                  <TableCell className="text-center">{`${amount.toFixed(2)}` || "NA"}</TableCell>
                </TableRow>
              })}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}

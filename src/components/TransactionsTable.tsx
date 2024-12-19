import React, { useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { MatchedOrder } from '@/lib/types'
import { Badge } from './ui/badge'
import { AddTag } from './AddTag'
import { formatAmount, formatDate, trimAddress, calculateAmount } from '@/lib/utils'
import { Button } from './ui/button'
import { Copy } from 'lucide-react'

type Props = {
    orders: MatchedOrder[]
    addTagToUser: (address: string, tag: string) => void
}

const TransactionsTable = React.memo(({ orders, addTagToUser }: Props) => {

  const totalAmount = useMemo(() => 
    orders.reduce((acc, order) => 
      acc + calculateAmount(order.initiatorAtomicSwap.priceByOracle, order.initiatorAtomicSwap.amount, 8), 
    0
  ), [orders]);

  const renderedOrders = useMemo(() => 
    orders.map((order) => {
      const date = formatDate(order.CreatedAt);
      const address = trimAddress(order.maker);
      const amount = formatAmount(order.initiatorAtomicSwap.amount, 8).toFixed(2);

      const handleCopyAddress = () => {
        navigator.clipboard.writeText(order.maker)
      };

      return (
        <TableRow key={order.ID}>
          <TableCell className="font-medium text-center">{date}</TableCell>
          <TableCell className="font-medium text-center">{order.ID}</TableCell>
          <TableCell className='text-center'>{order.initiatorAtomicSwap.chain}</TableCell>
          <TableCell className='text-center'>{order.followerAtomicSwap.chain}</TableCell>
          <TableCell className="text-center">{amount}</TableCell>
          <TableCell className="text-left">
            <Button 
              variant="ghost" 
              className='m-0 p-0 flex items-center gap-2'
              onClick={handleCopyAddress}
            >
              {address}
              <Copy className="h-4 w-4 text-gray-500 hover:text-black" />
            </Button>
          </TableCell>
          <TableCell className="text-center">
            {order.tags && order.tags.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-1">
                {order.tags.map((tag, index) => (
                  <Badge 
                    key={`${order.ID}-${tag}-${index}`} 
                    variant="secondary"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-gray-400">--</span>
            )}
          </TableCell>
          <TableCell className="text-center">
            <AddTag 
              address={order.maker} 
              addTagToUser={addTagToUser}
            />
          </TableCell>
        </TableRow>
      );
    }), 
    [orders, addTagToUser]
  );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Date</TableHead>
            <TableHead className="text-center">Swap ID</TableHead>
            <TableHead className="text-center">Init Chain</TableHead>
            <TableHead className="text-center">Redeem Chain</TableHead>
            <TableHead className="text-center">Amount</TableHead>
            <TableHead className="text-left">Address</TableHead>
            <TableHead className="text-center">Tags</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderedOrders}
        </TableBody>
      </Table>
    </div>
  );
});

TransactionsTable.displayName = 'TransactionsTable';

export default TransactionsTable;